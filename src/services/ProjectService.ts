
import { supabase } from '@/integrations/supabase/client';
import { Project, KnowledgeBaseFile } from '@/types/supabase-custom';

export interface ProjectCreateInput {
  name: string;
  description?: string;
  type: string;
  targetLanguage: string;
}

export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  type?: string;
  targetLanguage?: string;
  progress?: number;
  status?: 'active' | 'archived' | 'completed';
}

export interface KnowledgeBaseFileInput {
  name: string;
  description?: string;
  fileType: string;
  size: string;
  url: string;
  category?: string;
}

export const ProjectService = {
  
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
    
    // Map the Supabase database format to our frontend format
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || undefined,
      type: item.type,
      targetLanguage: item.target_language,
      lastModified: new Date(item.updated_at).toLocaleDateString(),
      progress: item.progress,
      status: item.status as 'active' | 'archived' | 'completed',
    }));
  },
  
  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error(`Error fetching project with id ${id}:`, error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      type: data.type,
      targetLanguage: data.target_language,
      lastModified: new Date(data.updated_at).toLocaleDateString(),
      progress: data.progress,
      status: data.status as 'active' | 'archived' | 'completed',
    };
  },
  
  async create(input: ProjectCreateInput): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: input.name,
        description: input.description,
        type: input.type,
        target_language: input.targetLanguage,
        progress: 0,
        status: 'active'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      type: data.type,
      targetLanguage: data.target_language,
      lastModified: new Date(data.updated_at).toLocaleDateString(),
      progress: data.progress,
      status: data.status as 'active' | 'archived' | 'completed',
    };
  },
  
  async update(id: string, input: ProjectUpdateInput): Promise<Project> {
    // Convert from our frontend format to database format
    const dbInput: any = {};
    
    if (input.name !== undefined) dbInput.name = input.name;
    if (input.description !== undefined) dbInput.description = input.description;
    if (input.type !== undefined) dbInput.type = input.type;
    if (input.targetLanguage !== undefined) dbInput.target_language = input.targetLanguage;
    if (input.progress !== undefined) dbInput.progress = input.progress;
    if (input.status !== undefined) dbInput.status = input.status;
    
    const { data, error } = await supabase
      .from('projects')
      .update(dbInput)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating project with id ${id}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      type: data.type,
      targetLanguage: data.target_language,
      lastModified: new Date(data.updated_at).toLocaleDateString(),
      progress: data.progress,
      status: data.status as 'active' | 'archived' | 'completed',
    };
  },
  
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting project with id ${id}:`, error);
      throw error;
    }
  },
  
  // Knowledge base files
  async getProjectFiles(projectId: string): Promise<KnowledgeBaseFile[]> {
    const { data, error } = await supabase
      .from('knowledge_base_files')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error(`Error fetching files for project ${projectId}:`, error);
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      fileType: item.file_type,
      size: item.size,
      uploadDate: new Date(item.created_at).toLocaleDateString(),
      url: item.url,
      category: item.category || undefined,
    }));
  },
  
  async uploadFile(projectId: string, file: File): Promise<{ path: string; url: string }> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${projectId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `project-files/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('project_files')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }
    
    const { data } = supabase.storage
      .from('project_files')
      .getPublicUrl(filePath);
      
    return {
      path: filePath,
      url: data.publicUrl
    };
  },
  
  async addKnowledgeBaseFile(
    projectId: string, 
    input: KnowledgeBaseFileInput
  ): Promise<KnowledgeBaseFile> {
    const { data, error } = await supabase
      .from('knowledge_base_files')
      .insert({
        project_id: projectId,
        name: input.name,
        description: input.description,
        file_type: input.fileType,
        size: input.size,
        url: input.url,
        category: input.category
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error adding knowledge base file:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      fileType: data.file_type,
      size: data.size,
      uploadDate: new Date(data.created_at).toLocaleDateString(),
      url: data.url,
      category: data.category || undefined,
    };
  },
  
  async deleteKnowledgeBaseFile(id: string): Promise<void> {
    const { error } = await supabase
      .from('knowledge_base_files')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting knowledge base file with id ${id}:`, error);
      throw error;
    }
  }
};
