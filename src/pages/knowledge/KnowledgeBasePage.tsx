
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KnowledgeBaseMain } from '@/components/knowledge/KnowledgeBaseMain';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useKnowledgeBaseFiles } from '@/hooks/useKnowledgeBaseFiles';
import { useKnowledgeBaseOperations } from '@/components/knowledge/KnowledgeBaseOperations';

const KnowledgeBasePage = () => {
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
