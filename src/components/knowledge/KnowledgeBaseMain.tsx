
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusIcon, Upload, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KnowledgeBaseFileList, KBFile } from './KnowledgeBaseFileList';
import { KnowledgeBaseCategories, KBCategory } from './KnowledgeBaseCategories';
import { KnowledgeBaseAnalytics } from './KnowledgeBaseAnalytics';
import { KnowledgeBaseUpload } from './KnowledgeBaseUpload';
import { useKnowledgeBaseFiles } from '@/hooks/useKnowledgeBaseFiles';
import { useKnowledgeBaseFileOperations } from '@/hooks/useKnowledgeBaseOperations';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const KnowledgeBaseMain: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  
  const { 
    files, 
    setFiles, 
    categories, 
    isLoading, 
    updateCategories,
    refreshFiles 
  } = useKnowledgeBaseFiles(projectId);

  const {
    editModalOpen,
    setEditModalOpen,
    currentFile,
    editedDescription,
    setEditedDescription,
    handleEditFile,
    saveDescription,
    handleDeleteFile,
    handleFilesUploaded
  } = useKnowledgeBaseFileOperations({
    files,
    setFiles,
    updateCategories,
    refreshFiles
  });
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  useEffect(() => {
    refreshFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const filteredFiles = activeCategory
    ? files.filter(file => {
        const categoryName = categories.find(c => c.id === activeCategory)?.name;
        return file.category === categoryName;
      })
    : files;
    
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'size') {
      const getSizeInKB = (size: string) => {
        const match = size.match(/(\d+\.?\d*)\s*(KB|MB|GB)/);
        if (!match) return 0;
        const num = parseFloat(match[1]);
        const unit = match[2];
        if (unit === 'KB') return num;
        if (unit === 'MB') return num * 1024;
        if (unit === 'GB') return num * 1024 * 1024;
        return 0;
      };
      return getSizeInKB(b.size) - getSizeInKB(a.size);
    }
    // Default: date
    return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
  });

  const handleUpload = () => {
    setShowUploadDialog(true);
  };

  return (
    <div className="space-y-4">
      <ThemeCard className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">Knowledge Base</CardTitle>
          <CardDescription>
            Manage files that provide context and guidance for AI content generation
          </CardDescription>
        </CardHeader>
      </ThemeCard>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search files" 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Upload Date</SelectItem>
                <SelectItem value="name">File Name</SelectItem>
                <SelectItem value="size">File Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <KnowledgeBaseUpload onFilesUploaded={handleFilesUploaded} />
        </div>
      </div>
      
      <KnowledgeBaseFileList
        files={sortedFiles}
        onDelete={handleDeleteFile}
        onEdit={handleEditFile}
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
        onUpload={handleUpload}
      />
      
      {sortedFiles.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-md border border-slate-200">
          <p className="text-slate-500">No files match your current filters</p>
          {activeCategory && (
            <Button 
              variant="link" 
              onClick={() => setActiveCategory(null)}
              className="mt-2"
            >
              Clear category filter
            </Button>
          )}
          {searchQuery && (
            <Button 
              variant="link" 
              onClick={() => setSearchQuery('')}
              className="mt-2"
            >
              Clear search
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
