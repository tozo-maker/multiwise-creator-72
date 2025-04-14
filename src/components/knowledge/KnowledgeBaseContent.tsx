
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, FolderIcon } from 'lucide-react';
import { KnowledgeBaseFileListItem } from './KnowledgeBaseFileListItem';
import { KBFile, KnowledgeBaseFileList } from './KnowledgeBaseFileList';
import { KnowledgeBaseUpload } from './KnowledgeBaseUpload';
import { Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent } from '@/components/ui/tabs';

interface KnowledgeBaseContentProps {
  files: KBFile[];
  isLoading: boolean;
  onDeleteFile: (id: string) => void;
  onEditDescription: (id: string) => void;
  onPreviewFile: (id: string) => void;
  onDownloadFile: (id: string) => void;
  onFilesUploaded: (files: { file: File; description: string }[]) => void;
  projectId?: string;
}

export const KnowledgeBaseContent: React.FC<KnowledgeBaseContentProps> = ({
  files,
  isLoading,
  onDeleteFile,
  onEditDescription,
  onPreviewFile,
  onDownloadFile,
  onFilesUploaded,
  projectId
}) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleUpload = () => {
    setUploadDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-6">
          <KnowledgeBaseFileList
            files={files}
            onEdit={onEditDescription}
            onDelete={onDeleteFile}
            onPreview={onPreviewFile}
            onDownload={onDownloadFile}
            onUpload={handleUpload}
            isLoading={isLoading}
            projectId={projectId}
            projectFiles={[]}
          />
        </div>
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <KnowledgeBaseUpload
          onFilesUploaded={(files) => {
            onFilesUploaded(files);
            setUploadDialogOpen(false);
          }}
        />
      </Dialog>
    </div>
  );
};
