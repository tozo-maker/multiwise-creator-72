
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { useToast } from '@/hooks/use-toast';
import { KBFile } from '@/components/knowledge/KnowledgeBaseFileList';
import { KnowledgeBaseHeader } from '@/components/knowledge/KnowledgeBaseHeader';
import { KnowledgeBaseContent } from '@/components/knowledge/KnowledgeBaseContent';
import { KnowledgeBaseDescription } from '@/components/knowledge/KnowledgeBaseDescription';

export const KnowledgeBase = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();

  // Mock project data
  const project = {
    id: projectId || '1',
    name: 'Spanish Language Textbook',
    type: 'Textbook',
    targetLanguage: 'Spanish'
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
  
  // Use all files since we no longer filter by search
  const filteredFiles = files;
    
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
      setFiles(files.map(file => file.id === currentEditFile.id ? {
        ...file,
        description: editedDescription
      } : file));
      toast({
        title: "Description updated",
        description: `Updated description for ${currentEditFile.name}`
      });
      setEditDialogOpen(false);
    }
  };
  
  const handleDeleteFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
    toast({
      title: "File deleted",
      description: "The file has been removed from your Knowledge Base."
    });
  };
  
  const handlePreviewFile = (id: string) => {
    // In a real app this would open a preview
    toast({
      title: "File preview",
      description: "File preview functionality would open here."
    });
  };
  
  const handleDownloadFile = (id: string) => {
    // In a real app this would trigger a download
    toast({
      title: "File download",
      description: "File download would start here."
    });
  };
  
  const handleFilesUploaded = (newFiles: { file: File; description: string; }[]) => {
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
      description: `${newFiles.length} file(s) added to Knowledge Base.`
    });
  };

  return (
    <ModernLayout contentWidth="wide">
      <div className="space-y-6">
        <KnowledgeBaseHeader projectId={project.id} project={project} />
        
        <KnowledgeBaseContent
          files={filteredFiles}
          onDeleteFile={handleDeleteFile}
          onEditDescription={handleEditDescription}
          onPreviewFile={handlePreviewFile}
          onDownloadFile={handleDownloadFile}
          onFilesUploaded={handleFilesUploaded}
        />
        
        <KnowledgeBaseDescription
          isOpen={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          currentFile={currentEditFile}
          description={editedDescription}
          onDescriptionChange={setEditedDescription}
          onSave={saveDescription}
        />
      </div>
    </ModernLayout>
  );
};

export default KnowledgeBase;
