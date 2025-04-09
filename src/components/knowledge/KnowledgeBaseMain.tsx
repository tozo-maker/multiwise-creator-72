
import React, { useState } from 'react';
import { KnowledgeBaseFileList, KBFile } from './KnowledgeBaseFileList';
import { KnowledgeBaseCategories, KBCategory } from './KnowledgeBaseCategories';
import { KnowledgeBaseUpload } from './KnowledgeBaseUpload';

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
        <KnowledgeBaseFileList 
          files={files}
          onDelete={onDeleteFile}
          onEdit={(id, newDescription) => onEditFile(id, newDescription)}
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
      </div>
    </div>
  );
};
