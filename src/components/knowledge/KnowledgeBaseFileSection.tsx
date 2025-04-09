
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeBaseFileList, KBFile } from './KnowledgeBaseFileList';
import { Skeleton } from '@/components/ui/skeleton';
import { KBCategory } from './KnowledgeBaseCategories';
import { useTheme } from '@/contexts/ThemeContext';

interface KnowledgeBaseFileSectionProps {
  title: string;
  description: string;
  files: KBFile[];
  isLoading: boolean;
  categories: KBCategory[];
  onDeleteFile: (id: string) => void;
  onEditFile: (id: string) => void;
  onPreviewFile: (id: string) => void;
  onDownloadFile: (id: string) => void;
}

export const KnowledgeBaseFileSection: React.FC<KnowledgeBaseFileSectionProps> = ({
  title,
  description,
  files,
  isLoading,
  categories,
  onDeleteFile,
  onEditFile,
  onPreviewFile,
  onDownloadFile
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Card className={`col-span-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
      <CardHeader className="pb-3 px-6">
        <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>
          {title}
        </CardTitle>
        <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
          {isLoading 
            ? 'Loading your knowledge resources...'
            : `${files.length} resource${files.length !== 1 ? 's' : ''} available`}
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
            files={files}
            onDelete={onDeleteFile}
            onEdit={onEditFile}
            onPreview={onPreviewFile}
            onDownload={onDownloadFile}
            categories={categories.map(c => c.name)}
          />
        )}
      </CardContent>
    </Card>
  );
};
