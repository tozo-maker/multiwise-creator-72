
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, FolderIcon } from 'lucide-react';
import { KnowledgeBaseFileListItem } from './KnowledgeBaseFileListItem';

export interface KBFile {
  id: string;
  name: string;
  description: string;
  fileType: string;
  size: string;
  uploadDate: string;
  category?: string;
  tags?: string[];
  project_id?: string;
  url: string;
}

interface KnowledgeBaseFileListProps {
  files: KBFile[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  onUpload: () => void;
  isLoading?: boolean;
  projectId?: string;
  projectFiles?: KBFile[];
  categories?: string[]; // Added to fix KnowledgeBaseFileSection and KnowledgeBaseTabContent errors
}

export const KnowledgeBaseFileList: React.FC<KnowledgeBaseFileListProps> = ({
  files,
  onEdit,
  onDelete,
  onPreview,
  onDownload,
  onUpload,
  isLoading = false,
  projectId,
  projectFiles = []
}) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Knowledge Base Files</h2>
        <Button onClick={onUpload}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-slate-500 dark:text-slate-400">Loading files...</div>
      ) : files.length === 0 ? (
        <div className="text-slate-500 dark:text-slate-400">
          <FolderIcon className="mr-2 inline-block h-5 w-5" />
          No files in knowledge base yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="py-3.5 px-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-200">
                  File Name
                </th>
                <th className="py-3.5 px-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-200 hidden md:table-cell">
                  Category
                </th>
                <th className="py-3.5 px-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-200 hidden md:table-cell">
                  Type
                </th>
                <th className="py-3.5 px-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-200 hidden md:table-cell">
                  Size
                </th>
                <th className="py-3.5 px-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-200 hidden md:table-cell">
                  Upload Date
                </th>
                <th className="py-3.5 px-4 text-right text-sm font-semibold text-slate-900 dark:text-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
              {files.map((file) => (
                <KnowledgeBaseFileListItem
                  key={file.id}
                  file={file}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPreview={onPreview}
                  onDownload={onDownload}
                  projectId={projectId}
                  projectFiles={projectFiles}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
