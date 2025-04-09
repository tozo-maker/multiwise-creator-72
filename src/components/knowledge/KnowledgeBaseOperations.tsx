
import React from 'react';
import { KBFile } from '@/components/knowledge/KnowledgeBaseFileList';
import { KBCategory } from '@/components/knowledge/KnowledgeBaseCategories';
import { KnowledgeBaseService } from '@/services/KnowledgeBaseService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface KnowledgeBaseOperationsProps {
  files: KBFile[];
  setFiles: React.Dispatch<React.SetStateAction<KBFile[]>>;
  updateCategories: (files: KBFile[]) => void;
  refreshFiles?: () => void;
}

export const useKnowledgeBaseOperations = ({ 
  files, 
  setFiles, 
  updateCategories,
  refreshFiles
}: KnowledgeBaseOperationsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDeleteFile = async (id: string) => {
    if (!user) return;
    
    try {
      await KnowledgeBaseService.deleteFile(id);
      
      // Option 1: Update local state
      const updatedFiles = files.filter(file => file.id !== id);
      setFiles(updatedFiles);
      updateCategories(updatedFiles);
      
      // Option 2: Refresh from database
      if (refreshFiles) {
        refreshFiles();
      }
      
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
  
  const handleEditFile = async (id: string, newDescription: string) => {
    if (!user) return;
    
    try {
      await KnowledgeBaseService.updateFileDescription(id, newDescription);
      
      // Option 1: Update local state
      const updatedFiles = files.map(file => 
        file.id === id 
          ? { ...file, description: newDescription } 
          : file
      );
      
      setFiles(updatedFiles);
      
      // Option 2: Refresh from database
      if (refreshFiles) {
        refreshFiles();
      }
      
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
      const uploadedFiles = await KnowledgeBaseService.uploadFiles(user.id, newFiles);
      
      // Option 1: Update local state
      const updatedFiles = [...uploadedFiles, ...files];
      setFiles(updatedFiles);
      updateCategories(updatedFiles);
      
      // Option 2: Refresh from database
      if (refreshFiles) {
        refreshFiles();
      }
      
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

  return {
    handleDeleteFile,
    handleEditFile,
    handleFilesUploaded
  };
};
