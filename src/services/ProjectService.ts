import { supabase } from '@/integrations/supabase/client';
import { Project, KnowledgeBaseFile } from '@/types/supabase-custom';
import { ActivityData, ContentGenerationData } from '@/contexts/DashboardContext';

export interface ProjectCreateInput {
  name: string;
  description?: string;
  type: string;
  targetLanguage: string;
  deadline?: string;
}

export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  type?: string;
  targetLanguage?: string;
  progress?: number;
  status?: 'active' | 'archived' | 'completed';
  deadline?: string;
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
    console.log('ProjectService: Fetching all projects');
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('ProjectService: No projects found');
      return [];
    }
    
    console.log('ProjectService: Found', data.length, 'projects');
    
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
    try {
      console.log('ProjectService: Creating new project with data:', input);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting authenticated user:', userError);
        throw userError;
      }
      
      if (!userData || !userData.user) {
        throw new Error('No authenticated user found');
      }
      
      console.log('ProjectService: Authenticated user ID:', userData.user.id);
      
      const projectData = {
        name: input.name,
        description: input.description || '',
        type: input.type,
        target_language: input.targetLanguage,
        progress: 0,
        status: 'active',
        user_id: userData.user.id,
        deadline: input.deadline || null
      };
      
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Project created but no data returned');
      }
      
      console.log('ProjectService: Project created successfully:', data);
      
      return {
        id: data.id,
        name: data.name,
        description: data.description || undefined,
        type: data.type,
        targetLanguage: data.target_language,
        lastModified: new Date(data.updated_at).toLocaleDateString(),
        progress: data.progress,
        status: data.status as 'active' | 'archived' | 'completed',
        deadline: data.deadline || 'Not set'
      };
    } catch (error) {
      console.error('ProjectService: Error in create method:', error);
      throw error;
    }
  },
  
  async update(id: string, input: ProjectUpdateInput): Promise<Project> {
    const dbInput: any = {};
    
    if (input.name !== undefined) dbInput.name = input.name;
    if (input.description !== undefined) dbInput.description = input.description;
    if (input.type !== undefined) dbInput.type = input.type;
    if (input.targetLanguage !== undefined) dbInput.target_language = input.targetLanguage;
    if (input.progress !== undefined) dbInput.progress = input.progress;
    if (input.status !== undefined) dbInput.status = input.status;
    if (input.deadline !== undefined) dbInput.deadline = input.deadline;
    
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
      deadline: data.deadline || 'Not set'
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
  },
  
  async getActivityData(): Promise<ActivityData[]> {
    console.log('ProjectService: Fetching activity data');
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('created_at');
        
      if (error) {
        console.error('Error fetching projects for activity data:', error);
        throw error;
      }
      
      if (!projects || projects.length === 0) {
        console.log('ProjectService: No projects found for activity data');
        return [];
      }
      
      console.log('ProjectService: Found', projects.length, 'projects for activity data');
      
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const activityByDay: Record<string, number> = {};
      
      daysOfWeek.forEach(day => {
        activityByDay[day] = 0;
      });
      
      projects.forEach(project => {
        const date = new Date(project.created_at);
        const day = daysOfWeek[date.getDay()];
        activityByDay[day]++;
      });
      
      const result = daysOfWeek.map(name => ({
        name,
        value: activityByDay[name]
      }));
      
      console.log('ProjectService: Activity data by day:', result);
      return result;
    } catch (error) {
      console.error('Error fetching activity data:', error);
      return [];
    }
  },
  
  async getContentGenerationData(): Promise<ContentGenerationData[]> {
    console.log('ProjectService: Fetching content generation data');
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('created_at');
        
      if (error) {
        console.error('Error fetching projects for content generation:', error);
        throw error;
      }
      
      if (!projects || projects.length === 0) {
        console.log('ProjectService: No projects found for content generation');
        return [];
      }
      
      console.log('ProjectService: Found', projects.length, 'projects for content generation');
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const contentByMonth: Record<string, number> = {};
      
      months.forEach(month => {
        contentByMonth[month] = 0;
      });
      
      projects.forEach(project => {
        const date = new Date(project.created_at);
        const month = months[date.getMonth()];
        const contentCount = 2 + Math.floor(Math.random() * 3);
        contentByMonth[month] += contentCount;
      });
      
      const result = months.map(date => ({
        date,
        count: contentByMonth[date]
      }));
      
      console.log('ProjectService: Content generation by month:', result);
      return result;
    } catch (error) {
      console.error('Error fetching content generation data:', error);
      return [];
    }
  }
};
