
import { supabase } from '@/integrations/supabase/client';
import { ProjectOutline, OutlineSection, OutlineItem, OutlineVersion } from '@/types/outline';
import { AnthropicService } from './AnthropicService';
import { ConfigData } from '@/components/wizard/types';
import { DatabaseService } from '@/services/DatabaseService';

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
        const configExists = await DatabaseService.projectConfigExists(projectId);
        
        if (!configExists) {
          console.log('Project configuration does not exist');
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
        const configExists = await DatabaseService.projectConfigExists(projectId);
        
        if (!configExists) {
          console.log('No configuration exists for project:', projectId);
          throw new Error('Please save your project configuration before generating content');
        }
      } catch (error: any) {
        console.error('Error checking project config:', error);
        throw error;
      }
      
      // First try to get any existing outline
      let newOutline = await this.getOutlineByProject(projectId);
      
      // If no outline exists yet, create a new one
      if (!newOutline) {
        newOutline = await this.createOutline(
          projectId,
          `${projectConfig.name || 'Project'} Outline`,
          `AI-generated outline for ${projectConfig.name || 'project'}`
        );
      }
      
      if (!newOutline) {
        throw new Error("Failed to create initial outline");
      }
      
      // Build a detailed system prompt based on all configuration parameters
      const systemPrompt = `You are an educational content outline creator. 
      Create a detailed, well-structured outline for a ${projectConfig.projectType || 'educational'} project.
      The outline should be organized into logical sections and subsections.
      For each section, include brief descriptions of what should be covered.
      The content complexity should be at the ${projectConfig.complexity || 'intermediate'} level.
      The target audience is ${projectConfig.levels?.join(", ") || "all levels"}.
      Use ${projectConfig.pedagogy || "standard"} pedagogical methodology.`;
      
      const userPrompt = `Create a detailed educational outline for a ${projectConfig.projectType || 'course'} on ${projectConfig.subjects?.join(", ") || "general topics"} 
      targeting ${projectConfig.levels?.join(", ") || "all levels"} using ${projectConfig.pedagogy || "standard"} methodology.
      The project name is "${projectConfig.name || 'Educational Project'}" and will be taught in ${projectConfig.targetLanguage || "English"}.
      The content should be at ${projectConfig.complexity || "intermediate"} complexity level.
      
      Include the following sections:
      1. Introduction/Overview
      2. Main content sections (3-5 sections)
      3. Practical applications
      4. Summary/Conclusion
      
      For each section, provide 2-4 subsections with brief descriptions.`;
      
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
        
        // Parse the AI response into outline sections
        const sections = this.parseAIResponseIntoSections(response.content);
        
        console.log(`Generated ${sections.length} outline sections`);
        
        // Remove any existing sections first
        const { error: deleteError } = await supabase
          .from('outline_sections')
          .delete()
          .eq('outline_id', newOutline.id);
          
        if (deleteError) {
          console.error('Error deleting existing sections:', deleteError);
        }
        
        // Add the new sections
        for (const [index, section] of sections.entries()) {
          const { data: sectionData, error: sectionError } = await supabase
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
            
          if (sectionError) {
            console.error('Error creating section:', sectionError);
            continue;
          }
            
          console.log(`Created section: ${section.title}`);
            
          for (const [itemIndex, item] of section.items.entries()) {
            const { error: itemError } = await supabase
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
              
            if (itemError) {
              console.error('Error creating item:', itemError);
            } else {
              console.log(`Created item: ${item.title}`);
            }
          }
        }
        
        // Update the outline version
        const { error: updateError } = await supabase
          .from('project_outlines')
          .update({
            version: newOutline.version + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', newOutline.id);
          
        if (updateError) {
          console.error('Error updating outline version:', updateError);
        }
        
        // Return the updated outline
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
        if (line.match(/^#\s+/)) {
          // Main heading - skip
          continue;
        } else if (line.match(/^##\s+/)) {
          // Section heading
          if (currentSection) {
            sections.push(currentSection);
          }
          currentSection = {
            title: line.replace(/^##\s+/, ''),
            description: '',
            items: []
          };
          currentItem = null;
        } else if (line.match(/^###\s+/)) {
          // Subsection heading
          if (currentSection) {
            currentItem = {
              title: line.replace(/^###\s+/, ''),
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
      
      // If sections is empty, try to parse the response differently 
      // (sometimes AI doesn't use markdown headers)
      if (sections.length === 0) {
        console.log('No sections detected with markdown headers, trying alternate parsing');
        
        // Look for numbered sections or paragraphs
        const paragraphs = aiResponse.split('\n\n').filter(p => p.trim().length > 0);
        
        if (paragraphs.length > 0) {
          let currentTitle = 'Introduction';
          let currentDescription = paragraphs[0];
          let items: {title: string; description: string}[] = [];
          
          // Try to extract main sections from the text
          const sectionMatches = aiResponse.match(/\d+\.\s+([^\n]+)/g);
          if (sectionMatches && sectionMatches.length > 0) {
            sectionMatches.forEach((match, idx) => {
              const sectionTitle = match.replace(/^\d+\.\s+/, '');
              const startIdx = aiResponse.indexOf(match);
              const nextIdx = idx < sectionMatches.length - 1 ? aiResponse.indexOf(sectionMatches[idx + 1]) : aiResponse.length;
              const sectionContent = aiResponse.substring(startIdx + match.length, nextIdx).trim();
              
              // Look for subsections
              const subItems: {title: string; description: string}[] = [];
              const subMatches = sectionContent.match(/\d+\.\d+\.\s+([^\n]+)/g);
              
              if (subMatches && subMatches.length > 0) {
                subMatches.forEach((subMatch, subIdx) => {
                  const itemTitle = subMatch.replace(/^\d+\.\d+\.\s+/, '');
                  const subStartIdx = sectionContent.indexOf(subMatch);
                  const subNextIdx = subIdx < subMatches.length - 1 ? sectionContent.indexOf(subMatches[subIdx + 1]) : sectionContent.length;
                  const itemContent = sectionContent.substring(subStartIdx + subMatch.length, subNextIdx).trim();
                  
                  subItems.push({
                    title: itemTitle,
                    description: itemContent
                  });
                });
              }
              
              sections.push({
                title: sectionTitle,
                description: subItems.length > 0 ? '' : sectionContent,
                items: subItems.length > 0 ? subItems : [{ title: 'Overview', description: sectionContent }]
              });
            });
          }
          
          // If still no sections, create a simple structure
          if (sections.length === 0) {
            sections.push({
              title: 'Introduction',
              description: paragraphs[0],
              items: [{ title: 'Overview', description: 'Introduction to the topic' }]
            });
            
            if (paragraphs.length > 1) {
              sections.push({
                title: 'Main Content',
                description: 'Key content sections',
                items: paragraphs.slice(1, -1).map((p, i) => ({
                  title: `Section ${i + 1}`,
                  description: p
                }))
              });
            }
            
            if (paragraphs.length > 2) {
              sections.push({
                title: 'Conclusion',
                description: paragraphs[paragraphs.length - 1],
                items: [{ title: 'Summary', description: 'Summary of the main points' }]
              });
            }
          }
        }
      }
      
      // If still no sections, create a default structure
      if (sections.length === 0) {
        console.log('Creating default outline structure');
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
