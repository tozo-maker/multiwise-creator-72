
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTheme } from '@/contexts/ThemeContext';

interface FileDetails {
  file: File;
  description: string;
}

interface KnowledgeBaseUploadProps {
  onFilesUploaded: (files: { file: File, description: string }[]) => void;
}

export const KnowledgeBaseUpload: React.FC<KnowledgeBaseUploadProps> = ({ onFilesUploaded }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileDetails[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files).map(file => ({
        file,
        description: ''
      }));
      
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const newFiles = Array.from(event.dataTransfer.files).map(file => ({
        file,
        description: ''
      }));
      
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (index: number, description: string) => {
    setSelectedFiles(files => 
      files.map((file, i) => i === index ? { ...file, description } : file)
    );
  };

  const handleUpload = () => {
    onFilesUploaded(selectedFiles);
    setSelectedFiles([]);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragging 
            ? 'border-primary bg-primary/10' 
            : 'border-muted-foreground/20 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        id="file-upload-dropzone"
      >
        <input 
          type="file" 
          multiple 
          onChange={handleFileChange} 
          className="hidden" 
          ref={fileInputRef}
          id="file-upload-input"
        />
        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Drag files here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">
          Support for PDF, DOCX, images, and other file types
        </p>
      </div>

      <Dialog open={selectedFiles.length > 0} onOpenChange={(open) => {
        if (!open) setSelectedFiles([]);
        setIsDialogOpen(open);
      }}>
        <DialogContent className={isDark ? "bg-slate-800 border-slate-700" : "bg-white"}>
          <DialogHeader>
            <DialogTitle className={isDark ? "text-slate-100" : "text-slate-900"}>Upload Files</DialogTitle>
            <DialogDescription className={isDark ? "text-slate-400" : "text-slate-500"}>
              Add descriptions for your files before uploading
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4 max-h-[400px] overflow-y-auto">
            {selectedFiles.map((fileDetail, index) => (
              <Card key={index} className={`p-4 ${isDark ? "bg-slate-700 border-slate-600" : "bg-white"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className={`font-medium truncate max-w-[200px] ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                      {fileDetail.file.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {(fileDetail.file.size / 1024).toFixed(1)} KB
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                      className="h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`description-${index}`} className={`text-xs mb-1 block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Description (optional)
                  </Label>
                  <Textarea 
                    id={`description-${index}`}
                    placeholder="Enter a description for this file..."
                    value={fileDetail.description}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    className={`text-sm ${isDark ? "bg-slate-800 border-slate-600" : "bg-white"}`}
                  />
                </div>
              </Card>
            ))}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSelectedFiles([])}
              className={isDark ? "text-slate-300 border-slate-600" : ""}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload}>
              Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
