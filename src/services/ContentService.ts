import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

export interface ContentItem {
  id: string;
  title: string;
  type: string;
  content: string;
  project_id: string;
  status: 'draft' | 'published' | 'archived' | 'in-review';
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: ContentMetadata;
  version?: number;
  approval_workflow?: any[];
}

export interface ContentMetadata {
  description?: string;
  keywords?: string[];
  author?: string;
  contributors?: string[];
  language?: string;
  
  categories?: string[];
  tags?: string[];
  taxonomyTerms?: Record<string, string[]>;
  
  learningObjectives?: string[];
  educationalLevel?: string;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration?: number;
  
  audience?: 'elementary' | 'middle_school' | 'high_school' | 'undergraduate' | 'graduate' | 'adult_learning';
  
  publishDate?: string;
  expirationDate?: string;
  revisionDate?: string;
  revisionNotes?: string[];
  
  usageRights?: string;
  license?: string;
  copyright?: string;
  
  contentFormat?: string;
  wordCount?: number;
  fileSize?: number;
  lastRendered?: string;
  
  templateId?: string;
  parameters?: Record<string, any>;
  approvalWorkflow?: any[];
  variations?: any[];
  
  custom?: Record<string, any>;
}

export interface ContentCreateParams {
  title: string;
  type: string;
  content: string;
  project_id: string;
  status: 'draft' | 'published' | 'archived' | 'in-review';
  metadata?: ContentMetadata;
}

export interface ContentUpdateParams {
  title?: string;
  type?: string;
  content?: string;
  status?: 'draft' | 'published' | 'archived' | 'in-review';
  metadata?: ContentMetadata;
  version?: number;
  approval_workflow?: any[];
}

export interface ContentVersion {
  id: string;
  content_id: string;
  version: number;
  content: string;
  title?: string;
  changes?: string;
  metadata?: ContentMetadata;
  created_at: string;
  created_by?: string;
}

export const ContentService = {
  async getByProject(projectId: string): Promise<ContentItem[]> {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching content items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content items',
        variant: 'destructive',
      });
      return [];
    }
  },
  
  async getById(contentId: string): Promise<ContentItem | null> {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('id', contentId)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching content item:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content item',
        variant: 'destructive',
      });
      return null;
    }
  },
  
  async create(params: ContentCreateParams): Promise<ContentItem | null> {
    try {
      const user = supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('content_items')
        .insert([
          {
            title: params.title,
            type: params.type,
            content: params.content,
            project_id: params.project_id,
            status: params.status || 'draft',
            metadata: params.metadata || {},
            version: 1
          }
        ])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error creating content item:', error);
      toast({
        title: 'Error',
        description: 'Failed to create content item',
        variant: 'destructive',
      });
      return null;
    }
  },
  
  async update(contentId: string, params: ContentUpdateParams): Promise<ContentItem | null> {
    try {
      let versionIncrease = params.content || params.title ? 1 : 0;
      
      if (params.version) {
        versionIncrease = 0;
      }
      
      let updateData: any = {
        ...params,
        updated_at: new Date().toISOString()
      };
      
      const { data: currentItem } = await supabase
        .from('content_items')
        .select('*')
        .eq('id', contentId)
        .single();
      
      if (currentItem && versionIncrease > 0) {
        updateData.version = (currentItem.version || 0) + 1;
        
        await this.archiveCurrentVersion(currentItem);
      } else if (!currentItem) {
        updateData.version = 1;
      }
      
      const { data, error } = await supabase
        .from('content_items')
        .update(updateData)
        .eq('id', contentId)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error updating content item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content item',
        variant: 'destructive',
      });
      return null;
    }
  },
  
  async delete(contentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', contentId);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error deleting content item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete content item',
        variant: 'destructive',
      });
      return false;
    }
  },
  
  async archiveCurrentVersion(currentItem: ContentItem): Promise<void> {
    try {
      await supabase
        .from('content_versions')
        .insert({
          content_id: currentItem.id,
          version: currentItem.version || 1,
          content: currentItem.content,
          title: currentItem.title,
          metadata: currentItem.metadata,
          changes: `Update from version ${currentItem.version || 1}`,
        });
    } catch (error) {
      console.error('Error archiving content version:', error);
    }
  },
  
  async getVersionHistory(contentId: string): Promise<ContentVersion[]> {
    try {
      const { data, error } = await supabase
        .from('content_versions')
        .select('*')
        .eq('content_id', contentId)
        .order('version', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        return data;
      }
      
      const { data: contentItem } = await supabase
        .from('content_items')
        .select('*')
        .eq('id', contentId)
        .single();
        
      return [
        {
          id: '1',
          content_id: contentId,
          version: contentItem?.version || 1,
          content: contentItem?.content || '',
          title: contentItem?.title,
          changes: 'Initial version',
          created_at: contentItem?.created_at || new Date().toISOString(),
          created_by: contentItem?.user_id
        }
      ];
    } catch (error: any) {
      console.error('Error fetching content versions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load version history',
        variant: 'destructive',
      });
      return [];
    }
  },
  
  async createVersion(contentId: string, content: string, changeDescription: string = ''): Promise<ContentVersion | null> {
    try {
      const currentContent = await this.getById(contentId);
      
      if (!currentContent) {
        throw new Error('Content not found');
      }
      
      const newVersion = (currentContent.version || 1) + 1;
      
      const { data: versionData, error: versionError } = await supabase
        .from('content_versions')
        .insert({
          content_id: contentId,
          version: newVersion - 1,
          content: currentContent.content,
          title: currentContent.title,
          metadata: currentContent.metadata,
          changes: changeDescription || 'Version update',
        })
        .select()
        .single();
        
      if (versionError) throw versionError;
      
      await this.update(contentId, {
        content,
        version: newVersion
      });
      
      return {
        id: versionData.id,
        content_id: contentId,
        version: newVersion,
        content: content,
        title: currentContent.title,
        changes: changeDescription || 'New version created',
        created_at: new Date().toISOString(),
        created_by: currentContent.user_id
      };
    } catch (error: any) {
      console.error('Error creating content version:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new version',
        variant: 'destructive',
      });
      return null;
    }
  },
  
  async restoreVersion(versionId: string): Promise<ContentItem | null> {
    try {
      const { data: versionData, error: versionError } = await supabase
        .from('content_versions')
        .select('*')
        .eq('id', versionId)
        .single();
        
      if (versionError || !versionData) {
        throw new Error('Version not found');
      }
      
      const { data: currentContent, error: contentError } = await supabase
        .from('content_items')
        .select('*')
        .eq('id', versionData.content_id)
        .single();
        
      if (contentError || !currentContent) {
        throw new Error('Content not found');
      }
      
      await this.archiveCurrentVersion(currentContent);
      
      const newVersion = (currentContent.version || 1) + 1;
      
      const { data: updatedContent, error: updateError } = await supabase
        .from('content_items')
        .update({
          content: versionData.content,
          title: versionData.title,
          metadata: versionData.metadata,
          version: newVersion,
          updated_at: new Date().toISOString()
        })
        .eq('id', versionData.content_id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      toast({
        title: 'Version restored',
        description: `Restored to version ${versionData.version}`,
      });
      
      return updatedContent;
    } catch (error: any) {
      console.error('Error restoring content version:', error);
      toast({
        title: 'Error',
        description: 'Failed to restore version',
        variant: 'destructive',
      });
      return null;
    }
  },
  
  async updateMetadata(contentId: string, metadata: Partial<ContentMetadata>): Promise<ContentItem | null> {
    try {
      const { data: currentContent } = await supabase
        .from('content_items')
        .select('metadata')
        .eq('id', contentId)
        .single();
      
      if (!currentContent) {
        throw new Error('Content not found');
      }
      
      const updatedMetadata = {
        ...(currentContent.metadata || {}),
        ...metadata,
        lastUpdated: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('content_items')
        .update({
          metadata: updatedMetadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error updating content metadata:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content metadata',
        variant: 'destructive',
      });
      return null;
    }
  },
  
  async addTag(contentId: string, tag: string): Promise<string[] | null> {
    try {
      const { data: currentContent } = await supabase
        .from('content_items')
        .select('metadata')
        .eq('id', contentId)
        .single();
      
      if (!currentContent) {
        throw new Error('Content not found');
      }
      
      const currentTags = currentContent.metadata?.tags || [];
      
      if (!currentTags.includes(tag)) {
        const updatedTags = [...currentTags, tag];
        
        await supabase
          .from('content_items')
          .update({
            metadata: {
              ...(currentContent.metadata || {}),
              tags: updatedTags,
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', contentId);
          
        return updatedTags;
      }
      
      return currentTags;
    } catch (error: any) {
      console.error('Error adding tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to add tag',
        variant: 'destructive',
      });
      return null;
    }
  },
  
  async removeTag(contentId: string, tag: string): Promise<string[] | null> {
    try {
      const { data: currentContent } = await supabase
        .from('content_items')
        .select('metadata')
        .eq('id', contentId)
        .single();
      
      if (!currentContent || !currentContent.metadata) {
        throw new Error('Content or metadata not found');
      }
      
      const currentTags = currentContent.metadata.tags || [];
      const updatedTags = currentTags.filter(t => t !== tag);
      
      await supabase
        .from('content_items')
        .update({
          metadata: {
            ...currentContent.metadata,
            tags: updatedTags,
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId);
        
      return updatedTags;
    } catch (error: any) {
      console.error('Error removing tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove tag',
        variant: 'destructive',
      });
      return null;
    }
  },
  
  async getByMetadata(
    projectId: string, 
    metadataQuery: Record<string, any>
  ): Promise<ContentItem[]> {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('project_id', projectId);
        
      if (error) {
        throw error;
      }
      
      const filteredItems = data.filter(item => {
        if (!item.metadata) return false;
        
        return Object.entries(metadataQuery).every(([key, value]) => {
          if (Array.isArray(item.metadata[key])) {
            if (Array.isArray(value)) {
              return value.some(v => item.metadata[key].includes(v));
            } else {
              return item.metadata[key].includes(value);
            }
          }
          
          if (typeof item.metadata[key] === 'object' && item.metadata[key] !== null) {
            return JSON.stringify(item.metadata[key]) === JSON.stringify(value);
          }
          
          return item.metadata[key] === value;
        });
      });
      
      return filteredItems;
    } catch (error: any) {
      console.error('Error fetching content by metadata:', error);
      toast({
        title: 'Error',
        description: 'Failed to filter content by metadata',
        variant: 'destructive',
      });
      return [];
    }
  },
  
  async extractMetadata(content: string): Promise<Partial<ContentMetadata>> {
    const metadata: Partial<ContentMetadata> = {};
    
    metadata.wordCount = content.split(/\s+/).length;
    
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
      
    const wordFrequency: Record<string, number> = {};
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    metadata.keywords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
    
    if (content.match(/[àáâäæãåā]/i)) {
      metadata.language = 'fr';
    } else if (content.match(/[ñ]/i)) {
      metadata.language = 'es';
    } else if (content.match(/[äöüß]/i)) {
      metadata.language = 'de';
    } else {
      metadata.language = 'en';
    }
    
    metadata.contentFormat = 'text/markdown';
    
    return metadata;
  }
};
