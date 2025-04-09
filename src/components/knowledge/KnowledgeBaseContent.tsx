
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeBaseFileList, KBFile } from '@/components/knowledge/KnowledgeBaseFileList';
import { KnowledgeBaseUpload } from '@/components/knowledge/KnowledgeBaseUpload';
import { useTheme } from '@/contexts/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';
import { KnowledgeBaseDescription } from './KnowledgeBaseDescription';

interface KnowledgeBaseContentProps {
  files: KBFile[];
  isLoading?: boolean;
  onDeleteFile: (id: string) => void;
  onEditDescription: (id: string, description: string) => void;
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
  
  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditFile, setCurrentEditFile] = useState<KBFile | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  
  // Handler for edit button click
  const handleEditButtonClick = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setCurrentEditFile(file);
      setEditedDescription(file.description || '');
      setEditDialogOpen(true);
    }
  };
  
  // Handler for saving description
  const handleSaveDescription = () => {
    if (currentEditFile) {
      onEditDescription(currentEditFile.id, editedDescription);
      setEditDialogOpen(false);
    }
  };

  return (
    <>
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
              onEdit={handleEditButtonClick} 
              onPreview={onPreviewFile} 
              onDownload={onDownloadFile} 
            />
          )}
        </CardContent>
      </Card>
      
      {/* Add the description editor dialog */}
      <KnowledgeBaseDescription
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        currentFile={currentEditFile}
        description={editedDescription}
        onDescriptionChange={setEditedDescription}
        onSave={handleSaveDescription}
      />
    </>
  );
};
