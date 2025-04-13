
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileListEmptyState } from './FileListEmptyState';
import { FileListTable } from './FileListTable';
import { FileListFilter } from './FileListFilter';
import { KnowledgeBaseTagManager } from './KnowledgeBaseTagManager';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  project_id?: string;
}

interface KnowledgeBaseFileListProps {
  files: KBFile[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  onTagsUpdated?: (file: KBFile, tags: string[]) => void;
  categories?: string[];
  projectId?: string;
}

export const KnowledgeBaseFileList: React.FC<KnowledgeBaseFileListProps> = ({
  files,
  onDelete,
  onEdit,
  onPreview,
  onDownload,
  onTagsUpdated,
  categories = [],
  projectId
}) => {
  const { toast } = useToast();
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof KBFile>('uploadDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<KBFile | null>(null);

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

  // Get all unique tags from all files
  const allTags = Array.from(
    new Set(files.flatMap(file => file.tags || []))
  ).sort();

  const sortedFiles = [...files].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue === bValue) return 0;
    const comparison = aValue < bValue ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Filter by category and tag
  const filteredFiles = sortedFiles.filter(file => {
    const matchesCategory = categoryFilter 
      ? file.category === categoryFilter 
      : true;
      
    const matchesTag = tagFilter
      ? file.tags?.includes(tagFilter)
      : true;
      
    return matchesCategory && matchesTag;
  });

  const handleManageTags = (file: KBFile) => {
    setCurrentFile(file);
    setTagDialogOpen(true);
  };

  const handleTagsUpdated = async (file: KBFile, tags: string[]) => {
    try {
      // Update tags in Supabase
      if (file.id) {
        const { error } = await supabase
          .from('knowledge_base_files')
          .update({ tags })
          .eq('id', file.id);
          
        if (error) throw error;
      }
      
      // Update the UI
      if (onTagsUpdated) {
        onTagsUpdated(file, tags);
      }
      
      toast({
        title: 'Tags updated',
        description: `Updated tags for ${file.name}`,
      });
    } catch (error) {
      console.error('Error updating tags:', error);
      toast({
        title: 'Error',
        description: 'Failed to update tags',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <FileListFilter
        categories={categories}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        tags={allTags}
        tagFilter={tagFilter}
        onTagFilterChange={setTagFilter}
      />

      <FileListTable
        files={filteredFiles}
        onDelete={onDelete}
        onEdit={onEdit}
        onPreview={onPreview}
        onDownload={onDownload}
        onManageTags={handleManageTags}
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
        <div className="flex space-x-2">
          {categoryFilter && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCategoryFilter(null)} 
              className="h-8 text-xs"
            >
              Clear Category
            </Button>
          )}
          {tagFilter && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setTagFilter(null)} 
              className="h-8 text-xs"
            >
              Clear Tag
            </Button>
          )}
        </div>
      </div>
      
      <KnowledgeBaseTagManager 
        file={currentFile}
        isOpen={tagDialogOpen}
        onOpenChange={setTagDialogOpen}
        onTagsUpdated={handleTagsUpdated}
      />
    </div>
  );
};
