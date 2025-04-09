
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KnowledgeBaseMain } from '@/components/knowledge/KnowledgeBaseMain';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { KBFile } from '@/components/knowledge/KnowledgeBaseFileList';
import { KBCategory } from '@/components/knowledge/KnowledgeBaseCategories';

const KnowledgeBasePage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [files, setFiles] = useState<KBFile[]>([]);
  const [categories, setCategories] = useState<KBCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKnowledgeBaseFiles = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch files from Supabase
        const { data, error } = await supabase
          .from('knowledge_base_files')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Transform data to match KBFile interface
        const formattedFiles = data.map(file => ({
          id: file.id,
          name: file.name,
          description: file.description || '',
          fileType: file.file_type,
          size: file.size,
          uploadDate: new Date(file.created_at).toLocaleDateString(),
          category: file.category || undefined
        }));
        
        setFiles(formattedFiles);
        
        // Generate categories based on files
        const categoryMap = new Map<string, number>();
        data.forEach(file => {
          if (file.category) {
            const count = categoryMap.get(file.category) || 0;
            categoryMap.set(file.category, count + 1);
          }
        });
        
        // Generate random colors for categories
        const categoryColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        
        // Convert to category objects
        const categoryList: KBCategory[] = Array.from(categoryMap.entries()).map(([name, count], index) => ({
          id: `cat-${index}`,
          name,
          count,
          color: categoryColors[index % categoryColors.length]
        }));
        
        setCategories(categoryList);
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
    
    fetchKnowledgeBaseFiles();
  }, [user, toast]);

  const handleDeleteFile = async (id: string) => {
    if (!user) return;
    
    try {
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
      
      // Update categories
      const updatedFiles = files.filter(file => file.id !== id);
      const categoryMap = new Map<string, number>();
      
      updatedFiles.forEach(file => {
        if (file.category) {
          const count = categoryMap.get(file.category) || 0;
          categoryMap.set(file.category, count + 1);
        }
      });
      
      const categoryColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      
      const categoryList: KBCategory[] = Array.from(categoryMap.entries()).map(([name, count], index) => ({
        id: `cat-${index}`,
        name,
        count,
        color: categoryColors[index % categoryColors.length]
      }));
      
      setCategories(categoryList);
      
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive'
      });
    }
  };
  
  const handleEditFile = async (id: string, newDescription: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('knowledge_base_files')
        .update({ description: newDescription })
        .eq('id', id);
        
      if (error) throw error;
      
      setFiles(files.map(file => 
        file.id === id 
          ? { ...file, description: newDescription } 
          : file
      ));
      
      toast({
        title: "File updated",
        description: "The file description has been updated."
      });
    } catch (error) {
      console.error('Error updating file:', error);
      toast({
        title: 'Error',
        description: 'Failed to update file',
        variant: 'destructive'
      });
    }
  };
  
  const handleFilesUploaded = async (newFiles: { file: File, description: string }[]) => {
    if (!user) return;
    
    try {
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
          
        // Add to knowledge base files table
        const category = newFile.file.type.includes('image') 
          ? 'Images' 
          : newFile.file.type.includes('pdf') 
            ? 'Documents' 
            : 'Other';
            
        const { data: fileData, error: dbError } = await supabase
          .from('knowledge_base_files')
          .insert({
            user_id: user.id,
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
        
        return {
          id: fileData.id,
          name: fileData.name,
          description: fileData.description || '',
          fileType: fileData.file_type,
          size: fileData.size,
          uploadDate: new Date(fileData.created_at).toLocaleDateString(),
          category: fileData.category
        };
      });
      
      const newKbFiles = await Promise.all(uploadPromises);
      setFiles([...newKbFiles, ...files]);
      
      // Update categories
      const allFiles = [...newKbFiles, ...files];
      const categoryMap = new Map<string, number>();
      
      allFiles.forEach(file => {
        if (file.category) {
          const count = categoryMap.get(file.category) || 0;
          categoryMap.set(file.category, count + 1);
        }
      });
      
      const categoryColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      
      const categoryList: KBCategory[] = Array.from(categoryMap.entries()).map(([name, count], index) => ({
        id: `cat-${index}`,
        name,
        count,
        color: categoryColors[index % categoryColors.length]
      }));
      
      setCategories(categoryList);
      
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
    <DashboardLayout 
      contentWidth="wide" 
      pageTitle="Knowledge Base"
      pageDescription="Access and manage your educational resources"
      mainId="knowledge-base-main"
      aria-label="Knowledge Base page"
    >
      <DashboardProvider>
        <KnowledgeBaseMain 
          files={files}
          categories={categories}
          isLoading={isLoading}
          onDeleteFile={handleDeleteFile}
          onEditFile={handleEditFile}
          onFilesUploaded={handleFilesUploaded}
        />
      </DashboardProvider>
    </DashboardLayout>
  );
};

export default KnowledgeBasePage;
