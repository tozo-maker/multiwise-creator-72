
import { supabase } from '@/integrations/supabase/client';

export interface ContentItem {
  id: string;
  title: string;
  type: string;
  content: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived';
  author_id?: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface ContentCreateInput {
  title: string;
  type: string;
  content: string;
  project_id: string;
  status?: 'draft' | 'published' | 'archived';
  author_id?: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface ContentUpdateInput {
  title?: string;
  type?: string;
  content?: string;
  status?: 'draft' | 'published' | 'archived';
  author_id?: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

export class ContentService {
  static async getByProject(projectId: string): Promise<ContentItem[]> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching content:', error);
      throw error;
    }
  }
  
  static async getById(id: string): Promise<ContentItem | null> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching content by ID:', error);
      throw error;
    }
  }
  
  static async create(content: ContentCreateInput): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('content')
        .insert([
          {
            title: content.title,
            type: content.type,
            content: content.content,
            project_id: content.project_id,
            status: content.status || 'draft',
            author_id: content.author_id,
            metadata: content.metadata || {},
            tags: content.tags || []
          }
        ])
        .select('id')
        .single();
        
      if (error) throw error;
      
      return data.id;
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  }
  
  static async update(id: string, updates: ContentUpdateInput): Promise<void> {
    try {
      const { error } = await supabase
        .from('content')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  }
  
  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }
  
  static async getRecentByUser(userId: string, limit: number = 5): Promise<ContentItem[]> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('author_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching recent content:', error);
      throw error;
    }
  }
}
