import React, { useState, useEffect } from 'react';
import { KnowledgeBaseFileList, KBFile } from './KnowledgeBaseFileList';
import { KnowledgeBaseCategories, KBCategory } from './KnowledgeBaseCategories';
import { KnowledgeBaseUpload } from './KnowledgeBaseUpload';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeBaseMainProps {
  files: KBFile[];
  categories: KBCategory[];
  isLoading: boolean;
  onDeleteFile: (id: string) => void;
  onEditFile: (id: string, newDescription: string) => void;
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredFiles, setFilteredFiles] = useState<KBFile[]>(files);
  const { toast } = useToast();

  // Create adapter function that matches the expected signature
  const handleEdit = (id: string) => {
    // When edit is clicked, get the file and pass its current description
    const file = files.find(f => f.id === id);
    if (file) {
      onEditFile(id, file.description);
    }
  };

  // Filter files when activeCategory changes
  useEffect(() => {
    if (activeCategory) {
      const categoryName = categories.find(c => c.id === activeCategory)?.name;
      if (categoryName) {
        const filtered = files.filter(file => file.category === categoryName);
        setFilteredFiles(filtered);
      }
    } else {
      setFilteredFiles(files);
    }
  }, [activeCategory, files, categories]);

  // Update filtered files when files prop changes
  useEffect(() => {
    if (activeCategory) {
      // Keep the current category filter applied
      const categoryName = categories.find(c => c.id === activeCategory)?.name;
      if (categoryName) {
        setFilteredFiles(files.filter(file => file.category === categoryName));
      }
    } else {
      setFilteredFiles(files);
    }
  }, [files, activeCategory, categories]);

  // Display a message if no files are available
  if (files.length === 0 && !isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <KnowledgeBaseCategories 
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onAddCategory={() => {/* Add implementation later */}}
          />
        </div>
        <div className="md:col-span-3">
          <div className="flex justify-end mb-6">
            <KnowledgeBaseUpload onFilesUploaded={onFilesUploaded} />
          </div>
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-600">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">No files in Knowledge Base</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Upload files to enhance your project with specific context</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <KnowledgeBaseCategories 
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onAddCategory={() => {/* Add implementation later */}}
        />
      </div>
      <div className="md:col-span-3">
        <div className="flex justify-end mb-6">
          <KnowledgeBaseUpload onFilesUploaded={onFilesUploaded} />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <KnowledgeBaseFileList 
            files={filteredFiles}
            onDelete={onDeleteFile}
            onEdit={handleEdit}
            onPreview={(id) => {
              const file = files.find(f => f.id === id);
              if (file && file.url) window.open(file.url, '_blank');
            }}
            onDownload={(id) => {
              const file = files.find(f => f.id === id);
              if (file && file.url) {
                const link = document.createElement('a');
                link.href = file.url;
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
