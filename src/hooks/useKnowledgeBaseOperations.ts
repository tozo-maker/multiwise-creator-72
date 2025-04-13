
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { KBFile } from '@/components/knowledge/KnowledgeBaseFileList';
import { supabase } from '@/integrations/supabase/client';

interface UseKnowledgeBaseOperationsProps {
  files: KBFile[];
  setFiles: React.Dispatch<React.SetStateAction<KBFile[]>>;
  updateCategories: (filesList: KBFile[]) => void;
  refreshFiles: () => void;
}

export const useKnowledgeBaseFileOperations = ({
  files,
  setFiles,
  updateCategories,
  refreshFiles
}: UseKnowledgeBaseOperationsProps) => {
  const { toast } = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<KBFile | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);

  const handleEditFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setCurrentFile(file);
      setEditedDescription(file.description);
      setEditModalOpen(true);
    }
  };
  
  const handleManageTags = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setCurrentFile(file);
      setEditedTags(file.tags || []);
      setTagModalOpen(true);
    }
  };

  const saveDescription = async () => {
    if (!currentFile) return;
    
    try {
      const { data, error } = await supabase
        .from('knowledge_base_files')
        .update({ description: editedDescription })
        .eq('id', currentFile.id)
        .select();
        
      if (error) throw error;
      
      setFiles(files.map(file => 
        file.id === currentFile.id 
          ? { ...file, description: editedDescription } 
          : file
      ));
      
      toast({
        title: "Updated description",
        description: `Description updated for "${currentFile.name}"`
      });
      
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating file description:', error);
      toast({
        title: 'Error',
        description: 'Failed to update file description',
        variant: 'destructive'
      });
    }
  };
  
  const saveTags = async () => {
    if (!currentFile) return;
    
    try {
      const { data, error } = await supabase
        .from('knowledge_base_files')
        .update({ tags: editedTags })
        .eq('id', currentFile.id)
        .select();
        
      if (error) throw error;
      
      setFiles(files.map(file => 
        file.id === currentFile.id 
          ? { ...file, tags: editedTags } 
          : file
      ));
      
      toast({
        title: "Updated tags",
        description: `Tags updated for "${currentFile.name}"`
      });
      
      setTagModalOpen(false);
    } catch (error) {
      console.error('Error updating file tags:', error);
      toast({
        title: 'Error',
        description: 'Failed to update file tags',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      await supabase
        .from('knowledge_base_files')
        .delete()
        .eq('id', id);
        
      const updatedFiles = files.filter(file => file.id !== id);
      setFiles(updatedFiles);
      updateCategories(updatedFiles);
      
      toast({
        title: "File deleted",
        description: "The file has been removed from your knowledge base"
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the file',
        variant: 'destructive'
      });
    }
  };

  const handleFilesUploaded = (newFiles: { file: File, description: string }[]) => {
    refreshFiles();
    toast({
      title: `${newFiles.length} file${newFiles.length !== 1 ? 's' : ''} uploaded`,
      description: "Your knowledge base has been updated"
    });
  };

  return {
    // Edit description modal
    editModalOpen,
    setEditModalOpen,
    currentFile,
    editedDescription,
    setEditedDescription,
    handleEditFile,
    saveDescription,
    
    // Tag management
    tagModalOpen,
    setTagModalOpen,
    editedTags,
    setEditedTags,
    handleManageTags,
    saveTags,
    
    // File operations
    handleDeleteFile,
    handleFilesUploaded
  };
};
