import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { KnowledgeBaseFileList, KBFile } from '@/components/knowledge/KnowledgeBaseFileList';
import { KnowledgeBaseUpload } from '@/components/knowledge/KnowledgeBaseUpload';
import { KnowledgeBaseCategories, KBCategory } from '@/components/knowledge/KnowledgeBaseCategories';
import { KnowledgeBaseAnalytics } from '@/components/knowledge/KnowledgeBaseAnalytics';
import { KnowledgeBaseTagInput } from '@/components/knowledge/KnowledgeBaseTagInput';
import { Search, Filter, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

export const KnowledgeBaseAdvanced = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Mock project data
  const project = {
    id: projectId || '1',
    name: 'Spanish Language Textbook',
    type: 'Textbook',
    targetLanguage: 'Spanish',
  };
  
  // Mock categories
  const [categories, setCategories] = useState<KBCategory[]>([
    { id: 'curriculum', name: 'Curriculum', count: 2, color: '#4f46e5' },
    { id: 'guidelines', name: 'Guidelines', count: 1, color: '#0ea5e9' },
    { id: 'examples', name: 'Examples', count: 1, color: '#10b981' },
    { id: 'references', name: 'References', count: 1, color: '#f59e0b' }
  ]);
  
  // Mock KB files
  const [files, setFiles] = useState<KBFile[]>([
    {
      id: '1',
      name: 'Curriculum Standards.pdf',
      description: 'National curriculum standards document',
      fileType: 'pdf',
      size: '2.5 MB',
      uploadDate: '2023-06-15',
      category: 'curriculum',
      tags: ['standards', 'official', 'national']
    },
    {
      id: '2',
      name: 'Style Guide.docx',
      description: 'Official writing style guidelines for educational content',
      fileType: 'docx',
      size: '1.8 MB',
      uploadDate: '2023-06-18',
      category: 'guidelines',
      tags: ['style', 'writing', 'rules']
    },
    {
      id: '3',
      name: 'Example Chapter.docx',
      description: 'Example chapter with proper formatting and structure',
      fileType: 'docx',
      size: '3.2 MB',
      uploadDate: '2023-06-20',
      category: 'examples',
      tags: ['format', 'structure', 'sample']
    },
    {
      id: '4',
      name: 'Terminology.txt',
      description: 'Approved terminology list for consistent language',
      fileType: 'txt',
      size: '128 KB',
      uploadDate: '2023-06-22',
      category: 'curriculum',
      tags: ['terms', 'vocabulary', 'language']
    },
    {
      id: '5',
      name: 'Cultural References.pdf',
      description: 'Cultural context document for Spanish content',
      fileType: 'pdf',
      size: '4.1 MB',
      uploadDate: '2023-06-25',
      category: 'references',
      tags: ['culture', 'context', 'spanish']
    }
  ]);
  
  // State management
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [fileDetailDrawerOpen, setFileDetailDrawerOpen] = useState(false);
  const [currentEditFile, setCurrentEditFile] = useState<KBFile | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#4f46e5');
  const [sortBy, setSortBy] = useState('date');
  
  // Calculate file analytics
  const fileTypes = files.reduce((acc, file) => {
    acc[file.fileType] = (acc[file.fileType] || 0) + 1;
    return acc;
  }, {} as {[key: string]: number});
  
  const totalSize = files.reduce((total, file) => {
    const sizeMatch = file.size.match(/(\d+\.?\d*)\s*(KB|MB|GB)/);
    if (!sizeMatch) return total;
    
    const size = parseFloat(sizeMatch[1]);
    const unit = sizeMatch[2];
    
    if (unit === 'KB') return total + size * 0.001;
    if (unit === 'MB') return total + size;
    if (unit === 'GB') return total + size * 1000;
    return total;
  }, 0).toFixed(1) + ' MB';
  
  // Filter files based on category and search
  const filteredFiles = files.filter(file => {
    const matchesCategory = activeCategory ? file.category === activeCategory : true;
    const matchesSearch = searchQuery 
      ? file.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        file.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (file.tags && file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      : true;
    return matchesCategory && matchesSearch;
  });
  
  // Sort files
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
  
  // Handlers
  const handleEditFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setCurrentEditFile(file);
      setEditedDescription(file.description);
      setEditedCategory(file.category || '');
      setEditedTags(file.tags || []);
      setEditDialogOpen(true);
    }
  };
  
  const handleViewFileDetails = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setCurrentEditFile(file);
      setFileDetailDrawerOpen(true);
    }
  };
  
  const saveFileEdits = () => {
    if (currentEditFile) {
      setFiles(files.map(file => 
        file.id === currentEditFile.id 
          ? { 
              ...file, 
              description: editedDescription,
              category: editedCategory,
              tags: editedTags
            } 
          : file
      ));
      
      // Update category counts
      updateCategoryCounts();
      
      toast({
        title: "File updated",
        description: `Updated details for ${currentEditFile.name}`,
      });
      
      setEditDialogOpen(false);
    }
  };
  
  const handleAddCategory = () => {
    setCategoryDialogOpen(true);
  };
  
  const saveNewCategory = () => {
    if (newCategoryName.trim()) {
      const newCategoryId = newCategoryName.toLowerCase().replace(/\s+/g, '-');
      
      // Check if category already exists
      if (categories.some(cat => cat.id === newCategoryId)) {
        toast({
          title: "Category exists",
          description: "A category with this name already exists.",
          variant: "destructive"
        });
        return;
      }
      
      setCategories([
        ...categories,
        {
          id: newCategoryId,
          name: newCategoryName.trim(),
          count: 0,
          color: newCategoryColor
        }
      ]);
      
      setCategoryDialogOpen(false);
      setNewCategoryName('');
      
      toast({
        title: "Category added",
        description: `Added new category: ${newCategoryName.trim()}`
      });
    }
  };
  
  const handleDeleteFile = (id: string) => {
    const fileToDelete = files.find(f => f.id === id);
    setFiles(files.filter(file => file.id !== id));
    
    // Update category counts if the file had a category
    if (fileToDelete?.category) {
      updateCategoryCounts();
    }
    
    toast({
      title: "File deleted",
      description: "The file has been removed from your Knowledge Base.",
    });
  };
  
  const updateCategoryCounts = () => {
    const newCategoryCounts = {} as {[key: string]: number};
    
    // Count files per category
    files.forEach(file => {
      if (file.category) {
        newCategoryCounts[file.category] = (newCategoryCounts[file.category] || 0) + 1;
      }
    });
    
    // Update category counts
    setCategories(categories.map(category => ({
      ...category,
      count: newCategoryCounts[category.id] || 0
    })));
  };
  
  const handleFilesUploaded = (newFiles: { file: File, description: string }[]) => {
    // In a real app this would upload to backend
    const addedFiles = newFiles.map((newFile, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: newFile.file.name,
      description: newFile.description,
      fileType: newFile.file.name.split('.').pop() || '',
      size: `${(newFile.file.size / 1024).toFixed(1)} KB`,
      uploadDate: new Date().toISOString().split('T')[0],
      category: '',
      tags: []
    }));
    
    setFiles([...files, ...addedFiles]);
    
    toast({
      title: "Files uploaded",
      description: `${newFiles.length} file(s) added to Knowledge Base.`,
    });
  };
  
  return (
    <MainLayout>
      <ProjectWorkspaceHeader 
        projectName={project.name}
        projectType={project.type}
        targetLanguage={project.targetLanguage}
      />
      
      <ProjectWorkspaceTabs projectId={project.id} activeTab="knowledge-base" />
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Knowledge Base</h2>
        <p className="text-slate-500">
          Manage files that provide context and guidance for AI content generation.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar with categories and analytics */}
        <div className="md:col-span-1 space-y-6">
          <KnowledgeBaseCategories 
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onAddCategory={handleAddCategory}
          />
          
          <KnowledgeBaseAnalytics 
            totalFiles={files.length}
            totalSize={totalSize}
            fileTypes={fileTypes}
          />
        </div>
        
        {/* Main content area */}
        <div className="md:col-span-3 space-y-6">
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
            onPreview={handleViewFileDetails}
            onDownload={(id) => toast({ title: "File download", description: "File download would start here." })}
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
      </div>
      
      {/* Edit File Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit File Information</DialogTitle>
            <DialogDescription>
              Update the details for {currentEditFile?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Enter a description for this file..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={editedCategory} onValueChange={setEditedCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Category</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <KnowledgeBaseTagInput 
                tags={editedTags} 
                onChange={setEditedTags} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveFileEdits}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your knowledge base files
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input 
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryColor">Category Color</Label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: newCategoryColor }}
                ></div>
                <Input 
                  id="categoryColor"
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-20 h-10 p-1"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveNewCategory}
              disabled={!newCategoryName.trim()}
            >
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* File Details Drawer/Dialog (based on screen size) */}
      {isMobile ? (
        <Drawer open={fileDetailDrawerOpen} onOpenChange={setFileDetailDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{currentEditFile?.name}</DrawerTitle>
              <DrawerDescription>
                File details and preview
              </DrawerDescription>
            </DrawerHeader>
            
            <div className="px-4 py-2 space-y-4">
              {currentEditFile && (
                <>
                  <div className="p-4 bg-slate-50 rounded-md">
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-sm text-slate-600">{currentEditFile.description || 'No description provided'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">File Type</h4>
                      <p className="text-sm text-slate-600">{currentEditFile.fileType.toUpperCase()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Size</h4>
                      <p className="text-sm text-slate-600">{currentEditFile.size}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Uploaded</h4>
                      <p className="text-sm text-slate-600">{currentEditFile.uploadDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Category</h4>
                      <p className="text-sm text-slate-600">
                        {currentEditFile.category ? 
                          categories.find(c => c.id === currentEditFile.category)?.name || currentEditFile.category : 
                          'Uncategorized'}
                      </p>
                    </div>
                  </div>
                  
                  {currentEditFile.tags && currentEditFile.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentEditFile.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="py-4 border-t">
                    <p className="text-sm text-slate-500 mb-2">File Preview not available in this demo</p>
                    <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center">
                      <FileText className="h-12 w-12 text-slate-300" />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <DrawerFooter>
              <Button
                variant="outline"
                onClick={() => currentEditFile && handleEditFile(currentEditFile.id)}
              >
                Edit Details
              </Button>
              <DrawerClose asChild>
                <Button>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={fileDetailDrawerOpen} onOpenChange={setFileDetailDrawerOpen}>
          <DialogContent className="sm:max-w-[620px]">
            <DialogHeader>
              <DialogTitle>{currentEditFile?.name}</DialogTitle>
              <DialogDescription>
                File details and preview
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              {currentEditFile && (
                <>
                  <div className="p-4 bg-slate-50 rounded-md">
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-sm text-slate-600">{currentEditFile.description || 'No description provided'}</p>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">File Type</h4>
                      <p className="text-sm text-slate-600">{currentEditFile.fileType.toUpperCase()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Size</h4>
                      <p className="text-sm text-slate-600">{currentEditFile.size}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Uploaded</h4>
                      <p className="text-sm text-slate-600">{currentEditFile.uploadDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Category</h4>
                      <p className="text-sm text-slate-600">
                        {currentEditFile.category ? 
                          categories.find(c => c.id === currentEditFile.category)?.name || currentEditFile.category : 
                          'Uncategorized'}
                      </p>
                    </div>
                  </div>
                  
                  {currentEditFile.tags && currentEditFile.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentEditFile.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="py-4 border-t">
                    <p className="text-sm text-slate-500 mb-2">File Preview not available in this demo</p>
                    <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center">
                      <FileText className="h-12 w-12 text-slate-300" />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setFileDetailDrawerOpen(false);
                  if (currentEditFile) {
                    setTimeout(() => handleEditFile(currentEditFile.id), 100);
                  }
                }}
              >
                Edit Details
              </Button>
              <Button onClick={() => setFileDetailDrawerOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default KnowledgeBaseAdvanced;
