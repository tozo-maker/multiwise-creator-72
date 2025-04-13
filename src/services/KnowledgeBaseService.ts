
import { supabase } from '@/integrations/supabase/client';
import { KBFile } from '@/components/knowledge/KnowledgeBaseFileList';

export class KnowledgeBaseService {
  static async deleteFile(id: string) {
    console.log('Deleting file with ID:', id);
    const { error } = await supabase
      .from('knowledge_base_files')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  }
  
  static async updateFileDescription(id: string, newDescription: string) {
    console.log('Updating file description for ID:', id, 'New description:', newDescription);
    const { error } = await supabase
      .from('knowledge_base_files')
      .update({ description: newDescription })
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  }
  
  static async getFilesByProject(projectId: string): Promise<KBFile[]> {
    console.log('Fetching knowledge base files for project:', projectId);
    
    const { data, error } = await supabase
      .from('knowledge_base_files')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching knowledge base files:', error);
      throw error;
    }
    
    // Transform data to match KBFile interface
    return data?.map(file => ({
      id: file.id,
      name: file.name,
      description: file.description || '',
      fileType: file.file_type,
      size: file.size || 'Unknown',
      uploadDate: new Date(file.created_at).toLocaleDateString(),
      category: file.category || 'Other',
      url: file.url || ''
    })) || [];
  }
  
  static async uploadFiles(userId: string, newFiles: { file: File, description: string }[]) {
    console.log('Uploading files for user:', userId, 'File count:', newFiles.length);
    const uploadPromises = newFiles.map(async (newFile) => {
      // Upload file to storage
      const fileExt = newFile.file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `knowledge-base/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project_files')
        .upload(filePath, newFile.file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('project_files')
        .getPublicUrl(filePath);
      
      console.log('File uploaded, public URL:', data.publicUrl);
        
      // Add to knowledge base files table
      const category = newFile.file.type.includes('image') 
        ? 'Images' 
        : newFile.file.type.includes('pdf') 
          ? 'Documents' 
          : 'Other';
          
      const { data: fileData, error: dbError } = await supabase
        .from('knowledge_base_files')
        .insert({
          user_id: userId,
          project_id: "general", // Can be updated to support specific projects
          name: newFile.file.name,
          description: newFile.description,
          file_type: fileExt || '',
          category: category,
          size: `${(newFile.file.size / 1024).toFixed(1)} KB`,
          url: data.publicUrl
        })
        .select()
        .single();
        
      if (dbError) throw dbError;
      
      console.log('File record created in database:', fileData);
      
      return {
        id: fileData.id,
        name: fileData.name,
        description: fileData.description || '',
        fileType: fileData.file_type,
        size: fileData.size,
        uploadDate: new Date(fileData.created_at).toLocaleDateString(),
        category: fileData.category,
        url: fileData.url
      };
    });
    
    return Promise.all(uploadPromises);
  }
}
