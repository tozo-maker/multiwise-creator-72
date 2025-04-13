
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileListEmptyState } from './FileListEmptyState';
import { FileListTable } from './FileListTable';
import { FileListFilter } from './FileListFilter';

export interface KBFile {
  id: string;
  name: string;
  description: string;
  fileType: string;
  size: string;
  uploadDate: string;
  category?: string;
  tags?: string[];
  url: string;
}

interface KnowledgeBaseFileListProps {
  files: KBFile[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  categories?: string[];
  projectId?: string;
}

export const KnowledgeBaseFileList: React.FC<KnowledgeBaseFileListProps> = ({
  files,
  onDelete,
  onEdit,
  onPreview,
  onDownload,
  categories = [],
  projectId
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof KBFile>('uploadDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  if (files.length === 0) {
    return <FileListEmptyState />;
  }

  const toggleSort = (field: keyof KBFile) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedFiles = [...files].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue === bValue) return 0;
    const comparison = aValue < bValue ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const filteredFiles = categoryFilter 
    ? sortedFiles.filter(file => file.category === categoryFilter) 
    : sortedFiles;

  return (
    <div className="space-y-6">
      <FileListFilter
        categories={categories}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
      />

      <FileListTable
        files={filteredFiles}
        onDelete={onDelete}
        onEdit={onEdit}
        onPreview={onPreview}
        onDownload={onDownload}
        categories={categories}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={toggleSort}
        projectId={projectId}
      />
      
      <div className="flex justify-between items-center text-sm text-slate-500 mt-4">
        <div>
          Showing {filteredFiles.length} of {files.length} files
        </div>
        {categoryFilter && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCategoryFilter(null)} 
            className="h-8 text-xs"
          >
            Clear Filter
          </Button>
        )}
      </div>
    </div>
  );
};
