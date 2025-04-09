
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { KnowledgeBaseFileSection } from './KnowledgeBaseFileSection';
import { KnowledgeBaseSidebar } from './KnowledgeBaseSidebar';
import { KnowledgeBaseAnalytics } from './KnowledgeBaseAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KBFile, KnowledgeBaseFileList } from './KnowledgeBaseFileList';
import { KBCategory } from './KnowledgeBaseCategories';
import { useTheme } from '@/contexts/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';

interface KnowledgeBaseTabContentProps {
  files: KBFile[];
  filteredFiles: KBFile[];
  categories: KBCategory[];
  isLoading: boolean;
  activeCategory: string | null;
  totalSize: string;
  fileTypes: Record<string, number>;
  onDeleteFile: (id: string) => void;
  onEditFile: (id: string) => void;
  onPreviewFile: (id: string) => void;
  onDownloadFile: (id: string) => void;
  onSelectCategory: (categoryId: string | null) => void;
  onAddCategory: () => void;
  onFilesUploaded: (files: { file: File, description: string }[]) => void;
}

export const KnowledgeBaseTabContent: React.FC<KnowledgeBaseTabContentProps> = ({
  files,
  filteredFiles,
  categories,
  isLoading,
  activeCategory,
  totalSize,
  fileTypes,
  onDeleteFile,
  onEditFile,
  onPreviewFile,
  onDownloadFile,
  onSelectCategory,
  onAddCategory,
  onFilesUploaded
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const getTitle = () => {
    return activeCategory 
      ? `Category: ${categories.find(c => c.id === activeCategory)?.name}` 
      : 'All Resources';
  };

  return (
    <>
      <TabsContent value="all" className="space-y-6 pt-2">
        <div className="grid gap-6 md:grid-cols-3">
          <KnowledgeBaseFileSection
            title={getTitle()}
            description={`${filteredFiles.length} resources available`}
            files={filteredFiles}
            isLoading={isLoading}
            categories={categories}
            onDeleteFile={onDeleteFile}
            onEditFile={onEditFile}
            onPreviewFile={onPreviewFile}
            onDownloadFile={onDownloadFile}
          />
          
          <KnowledgeBaseSidebar
            categories={categories}
            isLoading={isLoading}
            activeCategory={activeCategory}
            onSelectCategory={onSelectCategory}
            onAddCategory={onAddCategory}
            onFilesUploaded={onFilesUploaded}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="analytics" className="space-y-6 pt-2">
        <KnowledgeBaseAnalytics 
          totalFiles={files.length}
          totalSize={totalSize}
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
                onEdit={onEditFile}
                onPreview={onPreviewFile}
                onDownload={onDownloadFile}
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
                  onEdit={onEditFile}
                  onPreview={onPreviewFile}
                  onDownload={onDownloadFile}
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
                  onEdit={onEditFile}
                  onPreview={onPreviewFile}
                  onDownload={onDownloadFile}
                  categories={categories.map(c => c.name)}
                />
              ) : (
                <p className={`text-center py-12 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>No video resources found.</p>
              )
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};
