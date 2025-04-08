
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KnowledgeBaseFileList, KBFile } from './KnowledgeBaseFileList';
import { KnowledgeBaseUpload } from './KnowledgeBaseUpload';
import { KnowledgeBaseCategories, KBCategory } from './KnowledgeBaseCategories';
import { KnowledgeBaseAnalytics } from './KnowledgeBaseAnalytics';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

export const KnowledgeBaseMain = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Knowledge Base</h2>
          <p className={`mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your educational resources and materials.
          </p>
        </div>
        <div>
          <Button variant="default" className="px-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className={`p-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <TabsTrigger value="all" className={`px-4 py-2 ${isDark 
            ? 'data-[state=active]:bg-slate-700' 
            : 'data-[state=active]:bg-white'
          }`}>All Resources</TabsTrigger>
          <TabsTrigger value="documents" className={`px-4 py-2 ${isDark 
            ? 'data-[state=active]:bg-slate-700' 
            : 'data-[state=active]:bg-white'
          }`}>Documents</TabsTrigger>
          <TabsTrigger value="images" className={`px-4 py-2 ${isDark 
            ? 'data-[state=active]:bg-slate-700' 
            : 'data-[state=active]:bg-white'
          }`}>Images</TabsTrigger>
          <TabsTrigger value="videos" className={`px-4 py-2 ${isDark 
            ? 'data-[state=active]:bg-slate-700' 
            : 'data-[state=active]:bg-white'
          }`}>Videos</TabsTrigger>
          <TabsTrigger value="analytics" className={`px-4 py-2 ${isDark 
            ? 'data-[state=active]:bg-slate-700' 
            : 'data-[state=active]:bg-white'
          }`}>Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6 pt-2">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className={`col-span-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
              <CardHeader className="pb-3">
                <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>Recently Added</CardTitle>
                <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
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
            
            <div className="space-y-6">
              <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
                <CardHeader className="pb-3">
                  <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>Categories</CardTitle>
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
              
              <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
                <CardHeader className="pb-3">
                  <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <KnowledgeBaseUpload onFilesUploaded={handleFilesUploaded} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6 pt-2">
          <KnowledgeBaseAnalytics 
            totalFiles={files.length}
            totalSize="7.5 MB"
            fileTypes={fileTypes}
          />
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6 pt-2">
          <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>Documents</CardTitle>
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
        
        <TabsContent value="images" className="space-y-6 pt-2">
          <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>Images</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className={`text-center py-12 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Image resources will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-6 pt-2">
          <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>Videos</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className={`text-center py-12 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Video resources will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
