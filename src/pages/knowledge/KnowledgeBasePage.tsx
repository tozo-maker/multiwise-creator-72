
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KnowledgeBaseMain } from '@/components/knowledge/KnowledgeBaseMain';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useKnowledgeBaseFiles } from '@/hooks/useKnowledgeBaseFiles';
import { useKnowledgeBaseOperations } from '@/components/knowledge/KnowledgeBaseOperations';
import { useToast } from '@/hooks/use-toast';
import { KBFile } from '@/components/knowledge/KnowledgeBaseFileList';
import { KnowledgeBaseDescription } from '@/components/knowledge/KnowledgeBaseDescription';

const KnowledgeBasePage = () => {
  const { toast } = useToast();
  
  // Modal state for editing file descriptions
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<KBFile | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  
  // Use custom hook for file management
  const { 
    files, 
    setFiles, 
    categories, 
    isLoading, 
    updateCategories,
    refreshFiles 
  } = useKnowledgeBaseFiles();

  // Use operations hook for file operations
  const { 
    handleDeleteFile, 
    handleFilesUploaded 
  } = useKnowledgeBaseOperations({ 
    files, 
    setFiles, 
    updateCategories,
    refreshFiles
  });

  // Handler for editing file descriptions
  const handleEditFile = (id: string, description: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setCurrentFile(file);
      setEditedDescription(description);
      setEditModalOpen(true);
    }
  };
  
  // Save the edited description
  const saveDescription = async () => {
    if (!currentFile) return;
    
    try {
      // Call the service to update the description
      const { data, error } = await supabase
        .from('knowledge_base_files')
        .update({ description: editedDescription })
        .eq('id', currentFile.id)
        .select();
        
      if (error) throw error;
      
      // Update the file in the local state
      setFiles(files.map(file => 
        file.id === currentFile.id 
          ? { ...file, description: editedDescription } 
          : file
      ));
      
      toast({
        title: "Updated description",
        description: `Description updated for "${currentFile.name}"`
      });
      
      // Close the modal
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

  // Refresh files when the component mounts
  useEffect(() => {
    refreshFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Log data for debugging
  useEffect(() => {
    console.log('KnowledgeBasePage - Files loaded:', files);
    console.log('KnowledgeBasePage - Categories:', categories);
  }, [files, categories]);

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
        
        {/* Edit Description Dialog */}
        <KnowledgeBaseDescription
          isOpen={editModalOpen}
          onOpenChange={setEditModalOpen}
          currentFile={currentFile}
          description={editedDescription}
          onDescriptionChange={setEditedDescription}
          onSave={saveDescription}
        />
      </DashboardProvider>
    </DashboardLayout>
  );
};

export default KnowledgeBasePage;
