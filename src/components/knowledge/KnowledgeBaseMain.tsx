
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KnowledgeBaseFileList, KBFile } from './KnowledgeBaseFileList';
import { KnowledgeBaseUpload } from './KnowledgeBaseUpload';
import { KnowledgeBaseCategories, KBCategory } from './KnowledgeBaseCategories';
import { KnowledgeBaseAnalytics } from './KnowledgeBaseAnalytics';
import { Button } from '@/components/ui/button';
import { Plus, SearchIcon, TagIcon, FolderIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const KnowledgeBaseMain = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Sample mock data for files
  const [files, setFiles] = useState<KBFile[]>([
    {
      id: '1',
      name: 'Curriculum Standards.pdf',
      description: 'National curriculum standards document',
      fileType: 'pdf',
      size: '2.5 MB',
      uploadDate: '2023-06-15'
    },
    {
      id: '2',
      name: 'Style Guide.docx',
      description: 'Official writing style guidelines for educational content',
      fileType: 'docx',
      size: '1.8 MB',
      uploadDate: '2023-06-18'
    },
    {
      id: '3',
      name: 'Example Chapter.docx',
      description: 'Example chapter with proper formatting and structure',
      fileType: 'docx',
      size: '3.2 MB',
      uploadDate: '2023-06-20'
    }
  ]);
  
  // Sample categories
  const categories: KBCategory[] = [
    { id: 'cat1', name: 'Curriculum', count: 2, color: '#3b82f6' },
    { id: 'cat2', name: 'Guidelines', count: 1, color: '#10b981' },
    { id: 'cat3', name: 'References', count: 0, color: '#f59e0b' }
  ];
  
  // Sample file types for analytics
  const fileTypes = {
    pdf: 2,
    docx: 2,
    txt: 1
  };

  // Event handlers
  const handleDeleteFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
    toast({
      title: "File deleted",
      description: "The file has been removed from your Knowledge Base."
    });
  };
  
  const handleEditFile = (id: string) => {
    toast({
      title: "Edit file",
      description: "File edit functionality would open here."
    });
  };
  
  const handlePreviewFile = (id: string) => {
    toast({
      title: "File preview",
      description: "File preview functionality would open here."
    });
  };
  
  const handleDownloadFile = (id: string) => {
    toast({
      title: "File download",
      description: "File download would start here."
    });
  };
  
  const handleFilesUploaded = (newFiles: { file: File, description: string }[]) => {
    toast({
      title: "Files uploaded",
      description: `${newFiles.length} file(s) added to Knowledge Base.`
    });
  };
  
  const handleAddCategory = () => {
    toast({
      title: "Add category",
      description: "Category creation dialog would open here."
    });
  };
  
  const handleSelectCategory = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    toast({
      title: categoryId ? "Category selected" : "All categories",
      description: categoryId 
        ? `Filtered to show ${categories.find(c => c.id === categoryId)?.name} category` 
        : "Showing all categories"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
          <p className="text-muted-foreground">
            Manage your educational resources and materials.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <SearchIcon className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button variant="default">
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recently Added</CardTitle>
                <CardDescription>
                  Your most recently added knowledge resources
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <KnowledgeBaseFileList 
                  files={files}
                  onDelete={handleDeleteFile}
                  onEdit={handleEditFile}
                  onPreview={handlePreviewFile}
                  onDownload={handleDownloadFile}
                />
              </CardContent>
            </Card>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <KnowledgeBaseCategories 
                    categories={categories}
                    activeCategory={activeCategory}
                    onSelectCategory={handleSelectCategory}
                    onAddCategory={handleAddCategory}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <KnowledgeBaseUpload onFilesUploaded={handleFilesUploaded} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <KnowledgeBaseAnalytics 
            totalFiles={files.length}
            totalSize="7.5 MB"
            fileTypes={fileTypes}
          />
        </TabsContent>
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <KnowledgeBaseFileList 
                files={files.filter(f => ['pdf', 'docx', 'doc', 'txt'].includes(f.fileType))}
                onDelete={handleDeleteFile}
                onEdit={handleEditFile}
                onPreview={handlePreviewFile}
                onDownload={handleDownloadFile}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Image resources will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Video resources will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
