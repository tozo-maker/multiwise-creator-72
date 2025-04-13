import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { useToast } from '@/hooks/use-toast';
import { KBFile } from '@/components/knowledge/KnowledgeBaseFileList';
import { KnowledgeBaseHeader } from '@/components/knowledge/KnowledgeBaseHeader';
import { KnowledgeBaseContent } from '@/components/knowledge/KnowledgeBaseContent';
import { KnowledgeBaseDescription } from '@/components/knowledge/KnowledgeBaseDescription';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/UnifiedAuthContext';

export const KnowledgeBase = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const { user } = useAuth();

  const [project, setProject] = useState({
    id: projectId || '1',
    name: 'Loading...',
    type: 'Loading...',
    targetLanguage: 'Loading...'
  });

  const [files, setFiles] = useState<KBFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
    
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditFile, setCurrentEditFile] = useState<KBFile | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId || !user) return;

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (error) throw error;

        if (data) {
          console.log('Project data fetched:', data);
          setProject({
            id: data.id,
            name: data.name,
            type: data.type,
            targetLanguage: data.target_language
          });
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project details',
          variant: 'destructive'
        });
      }
    };

    const fetchFiles = async () => {
      if (!projectId || !user) return;
      
      try {
        setIsLoading(true);
        console.log('Fetching files for project:', projectId);
        
        const { data, error } = await supabase
          .from('knowledge_base_files')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('Knowledge base files fetched:', data);
        
        const formattedFiles = data.map(file => ({
          id: file.id,
          name: file.name,
          description: file.description || '',
          fileType: file.file_type,
          size: file.size,
          uploadDate: new Date(file.created_at).toLocaleDateString(),
          url: file.url,
          category: file.category
        }));

        setFiles(formattedFiles);
      } catch (error) {
        console.error('Error fetching knowledge base files:', error);
        toast({
          title: 'Error',
          description: 'Failed to load knowledge base files',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
    fetchFiles();
  }, [projectId, user, toast]);
  
  const handleEditDescription = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setCurrentEditFile(file);
      setEditedDescription(file.description);
      setEditDialogOpen(true);
    }
  };
  
  const saveDescription = async () => {
    if (!currentEditFile || !user) return;
    
    try {
      const { error } = await supabase
        .from('knowledge_base_files')
        .update({ description: editedDescription })
        .eq('id', currentEditFile.id);
        
      if (error) throw error;
      
      setFiles(files.map(file => file.id === currentEditFile.id ? {
        ...file,
        description: editedDescription
      } : file));
      
      toast({
        title: "Description updated",
        description: `Updated description for ${currentEditFile.name}`
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating file description:', error);
      toast({
        title: 'Error',
        description: 'Failed to update description',
        variant: 'destructive'
      });
    }
  };
  
  const handleDeleteFile = async (id: string) => {
    if (!user) return;
    
    try {
      console.log('Deleting file with ID:', id);
      const { error } = await supabase
        .from('knowledge_base_files')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setFiles(files.filter(file => file.id !== id));
      
      toast({
        title: "File deleted",
        description: "The file has been removed from your Knowledge Base."
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive'
      });
    }
  };
  
  const handlePreviewFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file && file.url) {
      window.open(file.url, '_blank');
    } else {
      toast({
        title: "File preview",
        description: `Unable to preview ${file?.name || 'file'}`
      });
    }
  };
  
  const handleDownloadFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file && file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast({
        title: "File download",
        description: `Unable to download ${file?.name || 'file'}`
      });
    }
  };
  
  const handleFilesUploaded = async (newFiles: { file: File; description: string; }[]) => {
    if (!projectId || !user) return;
    
    try {
      console.log('Uploading files for project:', projectId);
      const uploadPromises = newFiles.map(async (newFile) => {
        // 1. Upload file to storage
        const fileExt = newFile.file.name.split('.').pop();
        const fileName = `${projectId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `project-files/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('project_files')
          .upload(filePath, newFile.file);
          
        if (uploadError) throw uploadError;
        
        // 2. Get public URL
        const { data } = supabase.storage
          .from('project_files')
          .getPublicUrl(filePath);
        
        console.log('File uploaded, public URL:', data.publicUrl);
          
        // 3. Add to knowledge base files table
        const category = newFile.file.type.includes('image') 
          ? 'Images' 
          : newFile.file.type.includes('pdf') 
            ? 'Documents' 
            : 'Other';
            
        const { data: fileData, error: dbError } = await supabase
          .from('knowledge_base_files')
          .insert({
            project_id: projectId,
            user_id: user.id,
            name: newFile.file.name,
            description: newFile.description,
            file_type: fileExt || '',
            size: `${(newFile.file.size / 1024).toFixed(1)} KB`,
            url: data.publicUrl,
            category: category
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
          url: fileData.url,
          category: fileData.category
        };
      });
      
      const newKbFiles = await Promise.all(uploadPromises);
      setFiles([...newKbFiles, ...files]);
      
      toast({
        title: "Files uploaded",
        description: `${newFiles.length} file(s) added to Knowledge Base.`
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload files',
        variant: 'destructive'
      });
    }
  };

  return (
    <ModernLayout contentWidth="wide">
      <div className="space-y-6">
        <KnowledgeBaseHeader projectId={project.id} project={project} />
        
        <KnowledgeBaseContent
          files={files}
          isLoading={isLoading}
          onDeleteFile={handleDeleteFile}
          onEditDescription={handleEditDescription}
          onPreviewFile={handlePreviewFile}
          onDownloadFile={handleDownloadFile}
          onFilesUploaded={handleFilesUploaded}
          projectId={projectId}
        />
        
        <KnowledgeBaseDescription
          isOpen={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          currentFile={currentEditFile}
          description={editedDescription}
          onDescriptionChange={setEditedDescription}
          onSave={saveDescription}
        />
      </div>
    </ModernLayout>
  );
};

export default KnowledgeBase;
