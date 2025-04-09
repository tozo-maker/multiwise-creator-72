
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KBFile } from './KnowledgeBaseFileList';
import { KBCategory } from './KnowledgeBaseCategories';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { KnowledgeBaseDescription } from './KnowledgeBaseDescription';
import { KnowledgeBaseTabContent } from './KnowledgeBaseTabContent';

interface KnowledgeBaseMainProps {
  files: KBFile[];
  categories: KBCategory[];
  isLoading: boolean;
  onDeleteFile: (id: string) => void;
  onEditFile: (id: string, description: string) => void;
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
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditFile, setCurrentEditFile] = useState<KBFile | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  
  // Filter files based on active category and search term
  const filteredFiles = files.filter(file => {
    const matchesCategory = activeCategory ? file.category === activeCategory : true;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (file.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesCategory && matchesSearch;
  });
  
  // Calculate file types for analytics
  const fileTypes: Record<string, number> = {};
  files.forEach(file => {
    const type = file.fileType.toLowerCase();
    fileTypes[type] = (fileTypes[type] || 0) + 1;
  });
  
  // Calculate total size
  const totalSize = files.reduce((total, file) => {
    const sizeStr = file.size;
    const sizeNum = parseFloat(sizeStr);
    const unit = sizeStr.includes('MB') ? 1024 : 1;
    return total + (sizeNum * unit);
  }, 0);
  
  const formattedTotalSize = totalSize > 1024 
    ? `${(totalSize / 1024).toFixed(2)} MB` 
    : `${totalSize.toFixed(2)} KB`;
  
  const handlePreviewFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      toast({
        title: "File preview",
        description: `Previewing ${file.name}`
      });
    }
  };
  
  const handleDownloadFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      toast({
        title: "File download",
        description: `Downloading ${file.name}`
      });
    }
  };
  
  const handleAddCategory = () => {
    toast({
      title: "Add category",
      description: "Category creation dialog would open here."
    });
  };
  
  const handleSelectCategory = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    toast({
      title: categoryId ? "Category selected" : "All categories",
      description: categoryId 
        ? `Filtered to show ${categories.find(c => c.id === categoryId)?.name} category` 
        : "Showing all categories"
    });
  };

  // Handlers to interface with the KnowledgeBaseDescription component
  const handleEditButtonClick = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setCurrentEditFile(file);
      setEditedDescription(file.description || '');
      setEditDialogOpen(true);
    }
  };

  const handleSaveDescription = () => {
    if (currentEditFile) {
      onEditFile(currentEditFile.id, editedDescription);
      setEditDialogOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Knowledge Base</h2>
          <p className={`mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your educational resources and materials.
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className={`p-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <TabsTrigger value="all" className={`px-4 py-2 ${isDark 
            ? 'data-[state=active]:bg-slate-700' 
            : 'data-[state=active]:bg-white'
          }`}>All Resources</TabsTrigger>
          <TabsTrigger value="documents" className={`px-4 py-2 ${isDark 
            ? 'data-[state=active]:bg-slate-700' 
            : 'data-[state=active]:bg-white'
          }`}>Documents</TabsTrigger>
          <TabsTrigger value="images" className={`px-4 py-2 ${isDark 
            ? 'data-[state=active]:bg-slate-700' 
            : 'data-[state=active]:bg-white'
          }`}>Images</TabsTrigger>
          <TabsTrigger value="videos" className={`px-4 py-2 ${isDark 
            ? 'data-[state=active]:bg-slate-700' 
            : 'data-[state=active]:bg-white'
          }`}>Videos</TabsTrigger>
          <TabsTrigger value="analytics" className={`px-4 py-2 ${isDark 
            ? 'data-[state=active]:bg-slate-700' 
            : 'data-[state=active]:bg-white'
          }`}>Analytics</TabsTrigger>
        </TabsList>
        
        <KnowledgeBaseTabContent
          files={files}
          filteredFiles={filteredFiles}
          categories={categories}
          isLoading={isLoading}
          activeCategory={activeCategory}
          totalSize={formattedTotalSize}
          fileTypes={fileTypes}
          onDeleteFile={onDeleteFile}
          onEditFile={handleEditButtonClick}
          onPreviewFile={handlePreviewFile}
          onDownloadFile={handleDownloadFile}
          onSelectCategory={handleSelectCategory}
          onAddCategory={handleAddCategory}
          onFilesUploaded={onFilesUploaded}
        />
      </Tabs>

      {/* Add the KnowledgeBaseDescription modal */}
      <KnowledgeBaseDescription
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        currentFile={currentEditFile}
        description={editedDescription}
        onDescriptionChange={setEditedDescription}
        onSave={handleSaveDescription}
      />
    </div>
  );
};
