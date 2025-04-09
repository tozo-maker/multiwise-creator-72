
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeBaseFileList, KBFile } from '@/components/knowledge/KnowledgeBaseFileList';
import { KnowledgeBaseUpload } from '@/components/knowledge/KnowledgeBaseUpload';
import { useTheme } from '@/contexts/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';

interface KnowledgeBaseContentProps {
  files: KBFile[];
  isLoading?: boolean;
  onDeleteFile: (id: string) => void;
  onEditDescription: (id: string) => void;
  onPreviewFile: (id: string) => void;
  onDownloadFile: (id: string) => void;
  onFilesUploaded: (files: { file: File, description: string }[]) => void;
}

export const KnowledgeBaseContent: React.FC<KnowledgeBaseContentProps> = ({
  files,
  isLoading = false,
  onDeleteFile,
  onEditDescription,
  onPreviewFile,
  onDownloadFile,
  onFilesUploaded
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Card className={isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-xl ${isDark ? "text-slate-100" : "text-slate-900"}`}>Knowledge Base</CardTitle>
        <CardDescription className={isDark ? "text-slate-400" : "text-slate-500"}>
          Manage files that provide context and guidance for AI content generation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-6">
          <KnowledgeBaseUpload onFilesUploaded={onFilesUploaded} />
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <KnowledgeBaseFileList 
            files={files} 
            onDelete={onDeleteFile} 
            onEdit={onEditDescription} 
            onPreview={onPreviewFile} 
            onDownload={onDownloadFile} 
          />
        )}
      </CardContent>
    </Card>
  );
};
