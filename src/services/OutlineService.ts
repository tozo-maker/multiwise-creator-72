
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProjectOutline, OutlineSection, OutlineItem, OutlineVersion } from '@/types/outline';
import { AnthropicService } from './AnthropicService';
import { ConfigData } from '@/components/wizard/types';

export const OutlineService = {
  async getOutlineByProject(projectId: string): Promise<ProjectOutline | null> {
    try {
      console.log('Fetching outline for project:', projectId);
      
      const { data, error } = await supabase
        .from('project_outlines')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .maybeSingle();
      
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log('project_outlines table does not exist yet');
          return null;
        }
        console.error('Error in getOutlineByProject:', error);
        throw error;
      }
      
      if (!data) {
        console.log('No outline found for project:', projectId);
        return null;
      }
      
      console.log('Outline found:', data);
      return this.mapDbOutlineToProjectOutline(data);
    } catch (error: any) {
      console.error('Error fetching outline:', error);
      return null;
    }
  },
  
  async getSectionsByOutline(outlineId: string): Promise<OutlineSection[]> {
    try {
      const { data, error } = await supabase
        .from('outline_sections')
        .select('*, outline_items(*)')
        .eq('outline_id', outlineId)
        .order('order', { ascending: true });
      
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log('outline_sections table does not exist yet');
          return [];
        }
        throw error;
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      return data.map((section: any) => ({
        id: section.id,
        title: section.title,
        description: section.description,
        projectId: section.project_id,
        order: section.order,
        items: (section.outline_items || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          parentId: item.parent_id,
          order: item.order,
          projectId: item.project_id,
          contentId: item.content_id,
          status: item.status,
          metadata: item.metadata,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        })).sort((a: OutlineItem, b: OutlineItem) => a.order - b.order),
        createdAt: section.created_at,
        updatedAt: section.updated_at,
        metadata: section.metadata
      }));
    } catch (error: any) {
      console.error('Error fetching outline sections:', error);
      return [];
    }
  },
  
  async createOutline(projectId: string, title: string, description?: string): Promise<ProjectOutline | null> {
    try {
      console.log('Creating outline with project ID:', projectId, 'title:', title);
      
      // Check if project_config exists
      try {
        const { count, error: configError } = await supabase
          .from('project_config')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', projectId);
        
        if (configError && !configError.message.includes('does not exist')) {
          throw configError;
        }
        
        if (configError && configError.message.includes('does not exist')) {
          throw new Error('Project configuration is required. Please configure your project first.');
        }
        
        if (count === 0) {
          throw new Error('Project configuration is required. Please configure your project first.');
        }
      } catch (error: any) {
        console.error('Error checking project config:', error);
        throw error;
      }

      // Create outline if config exists
      const { data, error } = await supabase
        .from('project_outlines')
        .insert({
          project_id: projectId,
          title,
          description,
          version: 1,
          status: 'draft'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating outline:', error);
        throw error;
      }
      
      console.log('Created outline:', data);
      return this.mapDbOutlineToProjectOutline(data);
    } catch (error: any) {
      console.error('Error creating outline:', error);
      throw error;
    }
  },
  
  async updateOutline(outline: ProjectOutline): Promise<ProjectOutline | null> {
    try {
      await this.createOutlineVersion(outline);
      
      const { data, error } = await supabase
        .from('project_outlines')
        .update({
          title: outline.title,
          description: outline.description,
          status: outline.status,
          version: outline.version + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', outline.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      await this.updateOutlineSections(outline);
      
      return this.mapDbOutlineToProjectOutline(data);
    } catch (error: any) {
      console.error('Error updating outline:', error);
      throw error;
    }
  },
  
  async updateOutlineSections(outline: ProjectOutline): Promise<void> {
    try {
      for (const section of outline.sections) {
        if (!section.id.startsWith('new-')) {
          await supabase
            .from('outline_sections')
            .update({
              title: section.title,
              description: section.description,
              order: section.order,
              metadata: section.metadata,
              updated_at: new Date().toISOString()
            })
            .eq('id', section.id);
        } else {
          const { data } = await supabase
            .from('outline_sections')
            .insert({
              outline_id: outline.id,
              project_id: outline.projectId,
              title: section.title,
              description: section.description,
              order: section.order,
              metadata: section.metadata
            })
            .select()
            .single();
            
          section.id = data?.id;
        }
        
        if (section.items && section.items.length > 0) {
          await this.updateOutlineItems(section.items, outline.id, section.id);
        }
      }
    } catch (error) {
      console.error('Error updating outline sections:', error);
      throw error;
    }
  },
  
  async updateOutlineItems(items: OutlineItem[], outlineId: string, sectionId: string): Promise<void> {
    try {
      for (const item of items) {
        if (item.id.startsWith('new-')) {
          await supabase
            .from('outline_items')
            .insert({
              outline_id: outlineId,
              section_id: sectionId,
              project_id: item.projectId,
              title: item.title,
              description: item.description,
              parent_id: item.parentId,
              order: item.order,
              content_id: item.contentId,
              status: item.status,
              metadata: item.metadata
            });
        } else {
          await supabase
            .from('outline_items')
            .update({
              title: item.title,
              description: item.description,
              parent_id: item.parentId,
              order: item.order,
              content_id: item.contentId,
              status: item.status,
              metadata: item.metadata,
              updated_at: new Date().toISOString()
            })
            .eq('id', item.id);
        }
      }
    } catch (error) {
      console.error('Error updating outline items:', error);
      throw error;
    }
  },
  
  async deleteSection(sectionId: string): Promise<boolean> {
    try {
      await supabase
        .from('outline_items')
        .delete()
        .eq('section_id', sectionId);
        
      const { error } = await supabase
        .from('outline_sections')
        .delete()
        .eq('id', sectionId);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error deleting section:', error);
      return false;
    }
  },
  
  async deleteItem(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('outline_items')
        .delete()
        .eq('id', itemId);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error deleting item:', error);
      return false;
    }
  },
  
  async createOutlineVersion(outline: ProjectOutline): Promise<OutlineVersion | null> {
    try {
      const { data, error } = await supabase
        .from('outline_versions')
        .insert({
          outline_id: outline.id,
          version: outline.version,
          data: outline
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        outlineId: data.outline_id,
        version: data.version,
        data: data.data,
        createdAt: data.created_at,
        createdBy: data.created_by,
        notes: data.notes
      };
    } catch (error: any) {
      console.error('Error creating outline version:', error);
      return null;
    }
  },
  
  async getOutlineVersions(outlineId: string): Promise<OutlineVersion[]> {
    try {
      const { data, error } = await supabase
        .from('outline_versions')
        .select('*')
        .eq('outline_id', outlineId)
        .order('version', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data.map(version => ({
        id: version.id,
        outlineId: version.outline_id,
        version: version.version,
        data: version.data,
        createdAt: version.created_at,
        createdBy: version.created_by,
        notes: version.notes
      }));
    } catch (error: any) {
      console.error('Error fetching outline versions:', error);
      return [];
    }
  },
  
  async restoreOutlineVersion(versionId: string): Promise<ProjectOutline | null> {
    try {
      const { data: versionData, error: versionError } = await supabase
        .from('outline_versions')
        .select('*')
        .eq('id', versionId)
        .single();
        
      if (versionError || !versionData) {
        throw new Error('Version not found');
      }
      
      const { data: outlineData, error: outlineError } = await supabase
        .from('project_outlines')
        .select('*')
        .eq('id', versionData.outline_id)
        .single();
        
      if (outlineError || !outlineData) {
        throw new Error('Outline not found');
      }
      
      await this.createOutlineVersion(this.mapDbOutlineToProjectOutline(outlineData));
      
      const { data: updatedOutline, error: updateError } = await supabase
        .from('project_outlines')
        .update({
          title: versionData.data.title,
          description: versionData.data.description,
          version: outlineData.version + 1,
          status: versionData.data.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', versionData.outline_id)
        .select()
        .single();
        
      if (updateError) {
        throw updateError;
      }
      
      console.log('Version restored successfully');
      
      return this.mapDbOutlineToProjectOutline(updatedOutline);
    } catch (error: any) {
      console.error('Error restoring outline version:', error);
      return null;
    }
  },
  
  async generateOutlineWithAI(projectId: string, projectConfig: ConfigData): Promise<ProjectOutline | null> {
    try {
      console.log('Generating outline with AI for project:', projectId);
      console.log('Using project config:', projectConfig);
      
      // Check if project_config exists for this project to make sure config is saved
      try {
        const { data: configCheck, error: configError } = await supabase
          .from('project_config')
          .select('id')
          .eq('project_id', projectId)
          .maybeSingle();
        
        if (configError && !configError.message.includes('does not exist')) {
          throw configError;
        }
        
        if (!configCheck) {
          throw new Error('Please save your project configuration before generating content');
        }
      } catch (error: any) {
        console.error('Error checking project config:', error);
        throw error;
      }
      
      const newOutline = await this.createOutline(
        projectId,
        `${projectConfig.name} Outline`,
        `AI-generated outline for ${projectConfig.name}`
      );
      
      if (!newOutline) {
        throw new Error("Failed to create initial outline");
      }
      
      const systemPrompt = `You are an educational content outline creator. 
      Create a detailed, well-structured outline for a ${projectConfig.projectType} project.
      The outline should be organized into logical sections and subsections.
      For each section, include brief descriptions of what should be covered.`;
      
      const userPrompt = `Create an educational outline for a ${projectConfig.projectType} on ${projectConfig.subjects?.join(", ") || "general topics"} 
      targeting ${projectConfig.levels?.join(", ") || "all levels"} using ${projectConfig.pedagogy || "standard"} methodology.
      The project name is "${projectConfig.name}" and will be taught in ${projectConfig.targetLanguage || "English"}.
      The content should be at ${projectConfig.complexity || "intermediate"} complexity level.`;
      
      try {
        const response = await AnthropicService.generateContent({
          prompt: userPrompt,
          systemPrompt,
          projectId,
          language: projectConfig.targetLanguage || "English",
          audience: projectConfig.levels?.join(", ") || "general",
          complexity: projectConfig.complexity || "intermediate"
        });
        
        if (!response || !response.content) {
          throw new Error("Failed to generate outline with AI");
        }
        
        const sections = this.parseAIResponseIntoSections(response.content);
        
        for (const [index, section] of sections.entries()) {
          const { data: sectionData } = await supabase
            .from('outline_sections')
            .insert({
              outline_id: newOutline.id,
              project_id: projectId,
              title: section.title,
              description: section.description,
              order: index
            })
            .select()
            .single();
            
          for (const [itemIndex, item] of section.items.entries()) {
            await supabase
              .from('outline_items')
              .insert({
                outline_id: newOutline.id,
                section_id: sectionData.id,
                project_id: projectId,
                title: item.title,
                description: item.description,
                order: itemIndex,
                status: 'not_started'
              });
          }
        }
        
        return this.getOutlineByProject(projectId);
      } catch (error) {
        console.error('Error generating AI content:', error);
        throw new Error('Failed to generate AI content for outline');
      }
    } catch (error: any) {
      console.error('Error generating AI outline:', error);
      throw error;
    }
  },
  
  parseAIResponseIntoSections(aiResponse: string): { title: string; description: string; items: { title: string; description: string }[] }[] {
    const sections: { title: string; description: string; items: { title: string; description: string }[] }[] = [];
    
    try {
      const lines = aiResponse.split('\n');
      let currentSection: any = null;
      let currentItem: any = null;
      
      for (const line of lines) {
        if (line.startsWith('# ')) {
          continue;
        } else if (line.startsWith('## ')) {
          if (currentSection) {
            sections.push(currentSection);
          }
          currentSection = {
            title: line.replace('## ', ''),
            description: '',
            items: []
          };
          currentItem = null;
        } else if (line.startsWith('### ')) {
          if (currentSection) {
            currentItem = {
              title: line.replace('### ', ''),
              description: ''
            };
            currentSection.items.push(currentItem);
          }
        } else {
          const trimmedLine = line.trim();
          if (trimmedLine && currentItem) {
            currentItem.description += (currentItem.description ? '\n' : '') + trimmedLine;
          } else if (trimmedLine && currentSection) {
            currentSection.description += (currentSection.description ? '\n' : '') + trimmedLine;
          }
        }
      }
      
      if (currentSection) {
        sections.push(currentSection);
      }
      
      if (sections.length === 0) {
        sections.push({
          title: 'Introduction',
          description: 'Introduction section generated from AI content',
          items: [{
            title: 'Overview',
            description: 'Overview of the content'
          }]
        });
        
        sections.push({
          title: 'Main Content',
          description: 'Main content generated from AI',
          items: [{
            title: 'Key Points',
            description: aiResponse
          }]
        });
        
        sections.push({
          title: 'Conclusion',
          description: 'Summary and conclusion',
          items: [{
            title: 'Summary',
            description: 'Summary of the main points'
          }]
        });
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return [
        {
          title: 'Introduction',
          description: 'Introduction section',
          items: [{
            title: 'Overview',
            description: 'Overview of the content'
          }]
        },
        {
          title: 'Content',
          description: 'Main content',
          items: [{
            title: 'Content',
            description: aiResponse || 'No content available'
          }]
        }
      ];
    }
    
    return sections;
  },
  
  mapDbOutlineToProjectOutline(data: any): ProjectOutline {
    return {
      id: data.id,
      projectId: data.project_id,
      title: data.title,
      description: data.description,
      sections: [],
      version: data.version,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: data.created_by,
      updatedBy: data.updated_by
    };
  }
};
