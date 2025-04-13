
import React from 'react';
import { SortButton } from './SortButton';
import { KnowledgeBaseFileListItem } from './KnowledgeBaseFileListItem';
import { KBFile } from './KnowledgeBaseFileList';

interface FileListTableProps {
  files: KBFile[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  categories?: string[];
  sortField?: keyof KBFile;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (field: keyof KBFile) => void;
  projectId?: string;
}

export const FileListTable: React.FC<FileListTableProps> = ({
  files,
  onDelete,
  onEdit,
  onPreview,
  onDownload,
  sortField,
  sortDirection,
  onSortChange,
  projectId
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-500 dark:text-slate-400">
            <th className="py-3 px-4 text-left font-medium">
              <SortButton 
                label="Name" 
                field="name" 
                sortField={sortField || "name"} 
                sortDirection={sortDirection || "asc"} 
                onSort={onSortChange || (() => {})} 
              />
            </th>
            <th className="py-3 px-4 text-left font-medium hidden md:table-cell">
              <SortButton 
                label="Category" 
                field="category" 
                sortField={sortField || "name"} 
                sortDirection={sortDirection || "asc"} 
                onSort={onSortChange || (() => {})} 
              />
            </th>
            <th className="py-3 px-4 text-left font-medium hidden md:table-cell">
              <SortButton 
                label="Type" 
                field="fileType" 
                sortField={sortField || "name"} 
                sortDirection={sortDirection || "asc"} 
                onSort={onSortChange || (() => {})} 
              />
            </th>
            <th className="py-3 px-4 text-left font-medium hidden md:table-cell">
              <SortButton 
                label="Size" 
                field="size" 
                sortField={sortField || "name"} 
                sortDirection={sortDirection || "asc"} 
                onSort={onSortChange || (() => {})} 
              />
            </th>
            <th className="py-3 px-4 text-left font-medium hidden md:table-cell">
              <SortButton 
                label="Upload Date" 
                field="uploadDate" 
                sortField={sortField || "name"} 
                sortDirection={sortDirection || "asc"} 
                onSort={onSortChange || (() => {})} 
              />
            </th>
            <th className="py-3 px-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <KnowledgeBaseFileListItem
              key={file.id}
              file={file}
              onDelete={onDelete}
              onEdit={onEdit}
              onPreview={onPreview}
              onDownload={onDownload}
              projectId={projectId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
