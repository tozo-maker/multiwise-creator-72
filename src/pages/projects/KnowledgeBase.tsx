
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { KnowledgeBaseFileList, KBFile } from '@/components/knowledge/KnowledgeBaseFileList';
import { KnowledgeBaseUpload } from '@/components/knowledge/KnowledgeBaseUpload';
import { Search } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

export const KnowledgeBase = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  
  // Mock project data
  const project = {
    id: projectId || '1',
    name: 'Spanish Language Textbook',
    type: 'Textbook',
    targetLanguage: 'Spanish',
  };
  
  // Mock KB files
  const [files, setFiles] = useState<KBFile[]>([
    {
      id: '1',
      name: 'Curriculum Standards.pdf',
      description: 'National curriculum standards document',
      fileType: 'pdf',
      size: '2.5 MB',
      uploadDate: '2023-06-15'
    },
    {
      id: '2',
      name: 'Style Guide.docx',
      description: 'Official writing style guidelines for educational content',
      fileType: 'docx',
      size: '1.8 MB',
      uploadDate: '2023-06-18'
    },
    {
      id: '3',
      name: 'Example Chapter.docx',
      description: 'Example chapter with proper formatting and structure',
      fileType: 'docx',
      size: '3.2 MB',
      uploadDate: '2023-06-20'
    },
    {
      id: '4',
      name: 'Terminology.txt',
      description: 'Approved terminology list for consistent language',
      fileType: 'txt',
      size: '128 KB',
      uploadDate: '2023-06-22'
    },
    {
      id: '5',
      name: 'Cultural References.pdf',
      description: 'Cultural context document for Spanish content',
      fileType: 'pdf',
      size: '4.1 MB',
      uploadDate: '2023-06-25'
    }
  ]);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditFile, setCurrentEditFile] = useState<KBFile | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  
  const handleEditDescription = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setCurrentEditFile(file);
      setEditedDescription(file.description);
      setEditDialogOpen(true);
    }
  };
  
  const saveDescription = () => {
    if (currentEditFile) {
      setFiles(files.map(file => 
        file.id === currentEditFile.id 
          ? { ...file, description: editedDescription } 
          : file
      ));
      
      toast({
        title: "Description updated",
        description: `Updated description for ${currentEditFile.name}`,
      });
      
      setEditDialogOpen(false);
    }
  };
  
  const handleDeleteFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
    
    toast({
      title: "File deleted",
      description: "The file has been removed from your Knowledge Base.",
    });
  };
  
  const handlePreviewFile = (id: string) => {
    // In a real app this would open a preview
    toast({
      title: "File preview",
      description: "File preview functionality would open here.",
    });
  };
  
  const handleDownloadFile = (id: string) => {
    // In a real app this would trigger a download
    toast({
      title: "File download",
      description: "File download would start here.",
    });
  };
  
  const handleFilesUploaded = (newFiles: { file: File, description: string }[]) => {
    // In a real app this would upload to backend
    const addedFiles = newFiles.map((newFile, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: newFile.file.name,
      description: newFile.description,
      fileType: newFile.file.name.split('.').pop() || '',
      size: `${(newFile.file.size / 1024).toFixed(1)} KB`,
      uploadDate: new Date().toISOString().split('T')[0]
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
      
      <ProjectWorkspaceTabs projectId={project.id} />
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Knowledge Base</h2>
        <p className="text-slate-500">
          Manage files that provide context and guidance for AI content generation.
        </p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search files" className="pl-8" />
        </div>
        
        <KnowledgeBaseUpload onFilesUploaded={handleFilesUploaded} />
      </div>
      
      <KnowledgeBaseFileList 
        files={files}
        onDelete={handleDeleteFile}
        onEdit={handleEditDescription}
        onPreview={handlePreviewFile}
        onDownload={handleDownloadFile}
      />
      
      {/* Edit Description Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit File Description</DialogTitle>
            <DialogDescription>
              Update the description for {currentEditFile?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Enter a description for this file..."
              className="mt-2"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveDescription}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};
