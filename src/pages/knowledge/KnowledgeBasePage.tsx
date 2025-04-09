
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KnowledgeBaseMain } from '@/components/knowledge/KnowledgeBaseMain';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useKnowledgeBaseFiles } from '@/hooks/useKnowledgeBaseFiles';
import { useKnowledgeBaseOperations } from '@/components/knowledge/KnowledgeBaseOperations';
import { useToast } from '@/hooks/use-toast';
import { KBFile } from '@/components/knowledge/KnowledgeBaseFileList';
import { KnowledgeBaseDescription } from '@/components/knowledge/KnowledgeBaseDescription';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KnowledgeBaseTabContent } from '@/components/knowledge/KnowledgeBaseTabContent';
import { FileText, BarChart, Image, File, Video } from 'lucide-react';

const KnowledgeBasePage = () => {
  const { toast } = useToast();
  
  // Modal state for editing file descriptions
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<KBFile | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
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

  // Calculate filtered files based on active category
  const filteredFiles = activeCategory
    ? files.filter(file => {
        const categoryName = categories.find(c => c.id === activeCategory)?.name;
        return file.category === categoryName;
      })
    : files;

  // Calculate total size
  const calculateTotalSize = () => {
    const totalBytes = files.reduce((sum, file) => {
      const sizeStr = file.size;
      if (sizeStr.includes('KB')) {
        return sum + parseFloat(sizeStr) * 1024;
      } else if (sizeStr.includes('MB')) {
        return sum + parseFloat(sizeStr) * 1024 * 1024;
      } else if (sizeStr.includes('GB')) {
        return sum + parseFloat(sizeStr) * 1024 * 1024 * 1024;
      }
      return sum;
    }, 0);
    
    if (totalBytes < 1024) {
      return `${totalBytes} B`;
    } else if (totalBytes < 1024 * 1024) {
      return `${(totalBytes / 1024).toFixed(2)} KB`;
    } else if (totalBytes < 1024 * 1024 * 1024) {
      return `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  // Calculate file types
  const calculateFileTypes = () => {
    const fileTypes: Record<string, number> = {};
    files.forEach(file => {
      const type = file.fileType.toLowerCase();
      fileTypes[type] = (fileTypes[type] || 0) + 1;
    });
    return fileTypes;
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
        <ThemeCard className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">Knowledge Base</CardTitle>
            <CardDescription>
              Manage files that provide context and guidance for AI content generation
            </CardDescription>
          </CardHeader>
        </ThemeCard>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 h-auto p-1">
            <TabsTrigger value="all" className="flex items-center gap-2 py-2">
              <File className="h-4 w-4" />
              <span>All Files</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2 py-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2 py-2">
              <Image className="h-4 w-4" />
              <span>Images</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2 py-2">
              <Video className="h-4 w-4" />
              <span>Videos</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 py-2">
              <BarChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>
          
          <KnowledgeBaseTabContent 
            files={files}
            filteredFiles={filteredFiles}
            categories={categories}
            isLoading={isLoading}
            activeCategory={activeCategory}
            totalSize={calculateTotalSize()}
            fileTypes={calculateFileTypes()}
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
        </Tabs>
        
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
