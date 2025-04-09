
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KnowledgeBaseTabs } from '@/components/knowledge/KnowledgeBaseTabs';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useKnowledgeBaseFiles } from '@/hooks/useKnowledgeBaseFiles';
import { useKnowledgeBaseFileOperations } from '@/hooks/useKnowledgeBaseOperations';
import { KBFile } from '@/components/knowledge/KnowledgeBaseFileList';
import { KnowledgeBaseDescription } from '@/components/knowledge/KnowledgeBaseDescription';
import { KnowledgeBaseTabContent } from '@/components/knowledge/KnowledgeBaseTabContent';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useKnowledgeBaseStats } from '@/hooks/useKnowledgeBaseStats';

const KnowledgeBasePage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const { 
    files, 
    setFiles, 
    categories, 
    isLoading, 
    updateCategories,
    refreshFiles 
  } = useKnowledgeBaseFiles();

  const {
    editModalOpen,
    setEditModalOpen,
    currentFile,
    editedDescription,
    setEditedDescription,
    handleEditFile,
    saveDescription,
    handleDeleteFile,
    handleFilesUploaded
  } = useKnowledgeBaseFileOperations({
    files,
    setFiles,
    updateCategories,
    refreshFiles
  });

  useEffect(() => {
    refreshFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredFiles = activeCategory
    ? files.filter(file => {
        const categoryName = categories.find(c => c.id === activeCategory)?.name;
        return file.category === categoryName;
      })
    : files;

  const stats = useKnowledgeBaseStats(files);

  return (
    <DashboardLayout 
      contentWidth="wide" 
      pageTitle="Knowledge Base"
      pageDescription="Access and manage your educational resources"
      mainId="knowledge-base-main"
      aria-label="Knowledge Base page"
    >
      <DashboardProvider>
        <ThemeCard className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">Knowledge Base</CardTitle>
            <CardDescription>
              Manage files that provide context and guidance for AI content generation
            </CardDescription>
          </CardHeader>
        </ThemeCard>
        
        <KnowledgeBaseTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <KnowledgeBaseTabContent 
          files={files}
          filteredFiles={filteredFiles}
          categories={categories}
          isLoading={isLoading}
          activeCategory={activeCategory}
          totalSize={stats.totalSize}
          fileTypes={stats.fileTypes}
          onDeleteFile={handleDeleteFile}
          onEditFile={handleEditFile}
          onPreviewFile={(id) => {
            const file = files.find(f => f.id === id);
            if (file && file.url) window.open(file.url, '_blank');
          }}
          onDownloadFile={(id) => {
            const file = files.find(f => f.id === id);
            if (file && file.url) {
              const link = document.createElement('a');
              link.href = file.url;
              link.download = file.name;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
          onSelectCategory={setActiveCategory}
          onAddCategory={() => {/* Implement later */}}
          onFilesUploaded={handleFilesUploaded}
        />
        
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
