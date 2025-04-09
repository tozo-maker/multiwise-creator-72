
import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KnowledgeBaseMain } from '@/components/knowledge/KnowledgeBaseMain';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useKnowledgeBaseFiles } from '@/hooks/useKnowledgeBaseFiles';
import { useKnowledgeBaseOperations } from '@/components/knowledge/KnowledgeBaseOperations';
import { useToast } from '@/hooks/use-toast';

const KnowledgeBasePage = () => {
  const { toast } = useToast();
  
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
    handleEditFile, 
    handleFilesUploaded 
  } = useKnowledgeBaseOperations({ 
    files, 
    setFiles, 
    updateCategories,
    refreshFiles
  });

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
      </DashboardProvider>
    </DashboardLayout>
  );
};

export default KnowledgeBasePage;
