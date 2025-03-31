
import React, { useRef, useState } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  className?: string;
  showSelectedFiles?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesSelected,
  accept = ".pdf,.docx,.doc,.txt,.rtf",
  maxSize = 10, // Default 10 MB
  maxFiles = 10,
  className,
  showSelectedFiles = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: File[]): File[] => {
    setError(null);
    
    if (files.length === 0) return [];
    
    // Check number of files
    if (files.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} files at once.`);
      return [];
    }
    
    // Filter files by size and type
    const validFiles = Array.from(files).filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the maximum size of ${maxSize}MB.`);
        return false;
      }
      
      // Check file type if accept is specified
      if (accept && accept !== "*") {
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        const acceptedTypes = accept.split(',');
        
        if (!acceptedTypes.some(type => 
          type.trim() === fileExtension || 
          type.trim() === file.type ||
          (type.includes('*') && file.type.startsWith(type.replace('*', '')))
        )) {
          setError(`File "${file.name}" is not a supported file type.`);
          return false;
        }
      }
      
      return true;
    });
    
    return validFiles;
  };

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
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(droppedFiles);
      
      if (validFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = validateFiles(selectedFiles);
      
      if (validFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
        onFilesSelected(validFiles);
      }
      
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (fileName: string) => {
    const newFiles = selectedFiles.filter(file => file.name !== fileName);
    setSelectedFiles(newFiles);
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

  return (
    <div className={className}>
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200",
          dragActive ? "border-brand-500 bg-brand-50" : "border-slate-300 hover:border-brand-400",
          className
        )}
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
              Drag and drop files, or{" "}
              <button 
                type="button"
                className="text-brand-600 hover:text-brand-700 hover:underline" 
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </button>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports {accept.replace(/\./g, '').toUpperCase()} (Max {maxSize}MB per file)
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
            multiple={maxFiles > 1}
          />
        </div>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm mt-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      {showSelectedFiles && selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Selected files:</p>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-slate-50 rounded-md p-2 text-sm">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-slate-500" />
                <span className="truncate max-w-[200px]">{file.name}</span>
                <span className="text-slate-500 text-xs">{formatFileSize(file.size)}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => removeFile(file.name)}
              >
                <X className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
