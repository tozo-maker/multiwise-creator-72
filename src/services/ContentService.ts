
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
  metadata?: Record<string, any>;
  version?: number;
  approval_workflow?: any[];
}

export interface ContentCreateParams {
  title: string;
  type: string;
  content: string;
  project_id: string;
  status: 'draft' | 'published' | 'archived' | 'in-review';
  metadata?: Record<string, any>;
}

export interface ContentUpdateParams {
  title?: string;
  type?: string;
  content?: string;
  status?: 'draft' | 'published' | 'archived' | 'in-review';
  metadata?: Record<string, any>;
  version?: number;
  approval_workflow?: any[];
}

export const ContentService = {
  /**
   * Get all content items for a project
   */
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
  
  /**
   * Get a specific content item by ID
   */
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
  
  /**
   * Create a new content item
   */
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
  
  /**
   * Update an existing content item
   */
  async update(contentId: string, params: ContentUpdateParams): Promise<ContentItem | null> {
    try {
      // If updating content or important fields, increment version
      let versionIncrease = params.content || params.title ? 1 : 0;
      
      if (params.version) {
        // If version is explicitly provided, use it
        versionIncrease = 0;
      }
      
      let updateData: any = {
        ...params,
        updated_at: new Date().toISOString()
      };
      
      // Handle version increment
      if (versionIncrease > 0) {
        // First get the current version
        const { data: currentItem } = await supabase
          .from('content_items')
          .select('version')
          .eq('id', contentId)
          .single();
        
        if (currentItem) {
          updateData.version = (currentItem.version || 0) + 1;
        } else {
          updateData.version = 1;
        }
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
  
  /**
   * Delete a content item
   */
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
  
  /**
   * Get content item versions history
   */
  async getVersionHistory(contentId: string): Promise<any[]> {
    try {
      // In a real implementation, we would fetch from a content_versions table
      // For now, return a simulated version history
      return [
        {
          id: '1',
          content_id: contentId,
          version: 1,
          changes: 'Initial version',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          user_id: 'user1'
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
  
  /**
   * Create a new version of content
   */
  async createVersion(contentId: string, content: string): Promise<any | null> {
    try {
      // Get current content to increment version
      const currentContent = await this.getById(contentId);
      
      if (!currentContent) {
        throw new Error('Content not found');
      }
      
      const newVersion = (currentContent.version || 1) + 1;
      
      // Update content with new version
      await this.update(contentId, {
        content,
        version: newVersion
      });
      
      // In a real implementation, we would also create a record in content_versions
      
      return {
        id: `${contentId}-v${newVersion}`,
        content_id: contentId,
        version: newVersion,
        content: content,
        created_at: new Date().toISOString()
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
  }
};
