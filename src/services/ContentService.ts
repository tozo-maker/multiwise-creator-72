
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ContentItem {
  id: string;
  title: string;
  type: string;
  content: string;
  status: 'draft' | 'in-review' | 'completed';
  project_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContentCreateInput {
  title: string;
  type: string;
  content: string;
  project_id: string;
  status?: 'draft' | 'in-review' | 'completed';
}

export interface ContentUpdateInput {
  title?: string;
  type?: string;
  content?: string;
  status?: 'draft' | 'in-review' | 'completed';
}

export const ContentService = {
  async getByProject(projectId: string): Promise<ContentItem[]> {
    console.log('ContentService: Fetching content items for project:', projectId);
    
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching content items:', error);
      throw error;
    }
    
    console.log(`ContentService: Found ${data?.length || 0} content items`);
    
    return data?.map(item => ({
      id: item.id,
      title: item.title,
      type: item.type,
      content: item.content || '',
      status: item.status,
      project_id: item.project_id,
      created_at: new Date(item.created_at).toLocaleString(),
      updated_at: new Date(item.updated_at).toLocaleString()
    })) || [];
  },
  
  async getById(id: string): Promise<ContentItem | null> {
    console.log('ContentService: Fetching content item by ID:', id);
    
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching content item:', error);
      throw error;
    }
    
    if (!data) {
      console.log('ContentService: No content item found with ID:', id);
      return null;
    }
    
    console.log('ContentService: Found content item:', data.title);
    
    return {
      id: data.id,
      title: data.title,
      type: data.type,
      content: data.content || '',
      status: data.status,
      project_id: data.project_id,
      created_at: new Date(data.created_at).toLocaleString(),
      updated_at: new Date(data.updated_at).toLocaleString()
    };
  },
  
  async create(input: ContentCreateInput): Promise<ContentItem> {
    console.log('ContentService: Creating new content item:', input.title);
    
    const { data, error } = await supabase
      .from('content_items')
      .insert({
        title: input.title,
        type: input.type,
        content: input.content,
        project_id: input.project_id,
        status: input.status || 'draft'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating content item:', error);
      throw error;
    }
    
    console.log('ContentService: Created content item with ID:', data.id);
    
    return {
      id: data.id,
      title: data.title,
      type: data.type,
      content: data.content || '',
      status: data.status,
      project_id: data.project_id,
      created_at: new Date(data.created_at).toLocaleString(),
      updated_at: new Date(data.updated_at).toLocaleString()
    };
  },
  
  async update(id: string, input: ContentUpdateInput): Promise<ContentItem> {
    console.log('ContentService: Updating content item:', id);
    
    const updateData: any = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.type !== undefined) updateData.type = input.type;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.status !== undefined) updateData.status = input.status;
    
    const { data, error } = await supabase
      .from('content_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating content item:', error);
      throw error;
    }
    
    console.log('ContentService: Updated content item:', data.title);
    
    return {
      id: data.id,
      title: data.title,
      type: data.type,
      content: data.content || '',
      status: data.status,
      project_id: data.project_id,
      created_at: new Date(data.created_at).toLocaleString(),
      updated_at: new Date(data.updated_at).toLocaleString()
    };
  },
  
  async delete(id: string): Promise<void> {
    console.log('ContentService: Deleting content item:', id);
    
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting content item:', error);
      throw error;
    }
    
    console.log('ContentService: Deleted content item:', id);
  }
};
