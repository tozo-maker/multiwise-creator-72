
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KnowledgeBaseFileList, KBFile } from './KnowledgeBaseFileList';
import { KnowledgeBaseUpload } from './KnowledgeBaseUpload';
import { KnowledgeBaseCategories, KBCategory } from './KnowledgeBaseCategories';
import { KnowledgeBaseAnalytics } from './KnowledgeBaseAnalytics';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { KnowledgeBaseDescription } from './KnowledgeBaseDescription';

interface KnowledgeBaseMainProps {
  files: KBFile[];
  categories: KBCategory[];
  isLoading: boolean;
  onDeleteFile: (id: string) => void;
  onEditFile: (id: string, description: string) => void;
  onFilesUploaded: (files: { file: File, description: string }[]) => void;
}

export const KnowledgeBaseMain: React.FC<KnowledgeBaseMainProps> = ({
  files,
  categories,
  isLoading,
  onDeleteFile,
  onEditFile,
  onFilesUploaded
}) => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditFile, setCurrentEditFile] = useState<KBFile | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  
  // Filter files based on active category and search term
  const filteredFiles = files.filter(file => {
    const matchesCategory = activeCategory ? file.category === activeCategory : true;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (file.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesCategory && matchesSearch;
  });
  
  // Calculate file types for analytics
  const fileTypes: Record<string, number> = {};
  files.forEach(file => {
    const type = file.fileType.toLowerCase();
    fileTypes[type] = (fileTypes[type] || 0) + 1;
  });
  
  // Calculate total size
  const totalSize = files.reduce((total, file) => {
    const sizeStr = file.size;
    const sizeNum = parseFloat(sizeStr);
    const unit = sizeStr.includes('MB') ? 1024 : 1;
    return total + (sizeNum * unit);
  }, 0);
  
  const formattedTotalSize = totalSize > 1024 
    ? `${(totalSize / 1024).toFixed(2)} MB` 
    : `${totalSize.toFixed(2)} KB`;
  
  const handlePreviewFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      toast({
        title: "File preview",
        description: `Previewing ${file.name}`
      });
    }
  };
  
  const handleDownloadFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      toast({
        title: "File download",
        description: `Downloading ${file.name}`
      });
    }
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

  // New handlers to interface with the KnowledgeBaseDescription component
  const handleEditButtonClick = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setCurrentEditFile(file);
      setEditedDescription(file.description || '');
      setEditDialogOpen(true);
    }
  };

  const handleSaveDescription = () => {
    if (currentEditFile) {
      onEditFile(currentEditFile.id, editedDescription);
      setEditDialogOpen(false);
    }
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
          <Button variant="default" className="px-4" onClick={() => {
            document.getElementById('file-upload-input')?.click();
          }}>
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
          <div className="flex flex-col sm:flex-row mb-4 gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search files..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card className={`col-span-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
              <CardHeader className="pb-3 px-6">
                <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>
                  {activeCategory 
                    ? `Category: ${categories.find(c => c.id === activeCategory)?.name}` 
                    : 'All Resources'}
                </CardTitle>
                <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  {isLoading 
                    ? 'Loading your knowledge resources...'
                    : `${filteredFiles.length} resource${filteredFiles.length !== 1 ? 's' : ''} available`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="space-y-4 p-6">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <KnowledgeBaseFileList 
                    files={filteredFiles}
                    onDelete={onDeleteFile}
                    onEdit={handleEditButtonClick}
                    onPreview={handlePreviewFile}
                    onDownload={handleDownloadFile}
                    categories={categories.map(c => c.name)}
                  />
                )}
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
                <CardHeader className="pb-3">
                  <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    <KnowledgeBaseCategories 
                      categories={categories}
                      activeCategory={activeCategory}
                      onSelectCategory={handleSelectCategory}
                      onAddCategory={handleAddCategory}
                    />
                  )}
                </CardContent>
              </Card>
              
              <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
                <CardHeader className="pb-3">
                  <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <KnowledgeBaseUpload onFilesUploaded={onFilesUploaded} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6 pt-2">
          <KnowledgeBaseAnalytics 
            totalFiles={files.length}
            totalSize={formattedTotalSize}
            fileTypes={fileTypes}
          />
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6 pt-2">
          <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <KnowledgeBaseFileList 
                  files={files.filter(f => ['pdf', 'docx', 'doc', 'txt'].includes(f.fileType.toLowerCase()))}
                  onDelete={onDeleteFile}
                  onEdit={handleEditButtonClick}
                  onPreview={handlePreviewFile}
                  onDownload={handleDownloadFile}
                  categories={categories.map(c => c.name)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="images" className="space-y-6 pt-2">
          <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>Images</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                files.filter(f => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(f.fileType.toLowerCase())).length > 0 ? (
                  <KnowledgeBaseFileList 
                    files={files.filter(f => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(f.fileType.toLowerCase()))}
                    onDelete={onDeleteFile}
                    onEdit={handleEditButtonClick}
                    onPreview={handlePreviewFile}
                    onDownload={handleDownloadFile}
                    categories={categories.map(c => c.name)}
                  />
                ) : (
                  <p className={`text-center py-12 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>No image resources found.</p>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-6 pt-2">
          <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>Videos</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                files.filter(f => ['mp4', 'webm', 'avi', 'mov'].includes(f.fileType.toLowerCase())).length > 0 ? (
                  <KnowledgeBaseFileList 
                    files={files.filter(f => ['mp4', 'webm', 'avi', 'mov'].includes(f.fileType.toLowerCase()))}
                    onDelete={onDeleteFile}
                    onEdit={handleEditButtonClick}
                    onPreview={handlePreviewFile}
                    onDownload={handleDownloadFile}
                    categories={categories.map(c => c.name)}
                  />
                ) : (
                  <p className={`text-center py-12 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>No video resources found.</p>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add the KnowledgeBaseDescription modal */}
      <KnowledgeBaseDescription
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        currentFile={currentEditFile}
        description={editedDescription}
        onDescriptionChange={setEditedDescription}
        onSave={handleSaveDescription}
      />
    </div>
  );
};
