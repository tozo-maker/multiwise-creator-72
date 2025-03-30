
import React, { useRef, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Upload, File, X, Plus } from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

interface KnowledgeBaseUploadProps {
  onFilesUploaded: (files: { file: File, description: string }[]) => void;
}

export const KnowledgeBaseUpload: React.FC<KnowledgeBaseUploadProps> = ({ onFilesUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileDescriptions, setFileDescriptions] = useState<Record<string, string>>({});
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...filesArray]);
      
      // Initialize descriptions for new files
      const newDescriptions = { ...fileDescriptions };
      filesArray.forEach(file => {
        if (!newDescriptions[file.name]) {
          newDescriptions[file.name] = '';
        }
      });
      setFileDescriptions(newDescriptions);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...filesArray]);
      
      // Initialize descriptions for new files
      const newDescriptions = { ...fileDescriptions };
      filesArray.forEach(file => {
        if (!newDescriptions[file.name]) {
          newDescriptions[file.name] = '';
        }
      });
      setFileDescriptions(newDescriptions);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
    
    // Remove description for this file
    const newDescriptions = { ...fileDescriptions };
    delete newDescriptions[fileName];
    setFileDescriptions(newDescriptions);
  };

  const handleUpload = () => {
    const filesWithDescriptions = files.map(file => ({
      file,
      description: fileDescriptions[file.name] || ''
    }));
    
    onFilesUploaded(filesWithDescriptions);
    
    // Reset state
    setFiles([]);
    setFileDescriptions({});
    setOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };

  const updateDescription = (fileName: string, description: string) => {
    setFileDescriptions({
      ...fileDescriptions,
      [fileName]: description
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-brand-500 hover:bg-brand-600">
          <Plus className="h-4 w-4" />
          Upload Files
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload to Knowledge Base</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive ? 'border-brand-500 bg-brand-50' : 'border-slate-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Upload className="h-6 w-6 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drag and drop files, or <button 
                    className="text-brand-600 hover:text-brand-700 hover:underline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PDF, DOCX, DOC, TXT, RTF (Max 10MB per file)
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt,.rtf"
                multiple
              />
            </div>
          </div>
          
          {files.length > 0 && (
            <div className="space-y-3">
              <Label>Selected Files</Label>
              <div className="max-h-60 overflow-y-auto space-y-3">
                {files.map((file, index) => (
                  <div key={index} className="bg-slate-50 rounded-md p-3 border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <File className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.name)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="mt-2">
                      <Label htmlFor={`desc-${index}`} className="text-xs">
                        File Description (Optional)
                      </Label>
                      <Textarea 
                        id={`desc-${index}`}
                        placeholder="Describe what this file contains..."
                        className="mt-1 text-sm min-h-[60px]"
                        value={fileDescriptions[file.name] || ''}
                        onChange={(e) => updateDescription(file.name, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={files.length === 0}
            className="bg-brand-500 hover:bg-brand-600"
          >
            Upload {files.length > 0 ? `(${files.length})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
