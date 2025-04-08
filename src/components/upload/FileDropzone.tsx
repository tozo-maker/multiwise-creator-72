
import React, { useRef, useState, useCallback, KeyboardEvent } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  className?: string;
  showSelectedFiles?: boolean;
  id?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesSelected,
  accept = ".pdf,.docx,.doc,.txt,.rtf",
  maxSize = 10, // Default 10 MB
  maxFiles = 10,
  className,
  showSelectedFiles = true,
  id = "file-dropzone",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useTheme();

  const validateFiles = useCallback((files: File[]): File[] => {
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
  }, [accept, maxFiles, maxSize]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
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
  }, [validateFiles, onFilesSelected]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newSelectedFiles = Array.from(e.target.files);
      const validFiles = validateFiles(newSelectedFiles);
      
      if (validFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
        onFilesSelected(validFiles);
      }
      
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [validateFiles, onFilesSelected]);

  const removeFile = useCallback((fileName: string) => {
    setSelectedFiles(prev => {
      const newFiles = prev.filter(file => file.name !== fileName);
      return newFiles;
    });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    // Trigger file selection on Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  }, []);

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
          dragActive ? "border-brand-500 bg-brand-50 dark:bg-brand-900/10" : 
            "border-slate-300 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600",
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Upload files by clicking or dragging them here"
        id={id}
      >
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Upload className="h-6 w-6 text-slate-500 dark:text-slate-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Drag and drop files, or{" "}
              <button 
                type="button"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 rounded-sm" 
                onClick={() => fileInputRef.current?.click()}
                aria-label="Browse for files"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
            aria-hidden="true"
            tabIndex={-1}
            id={`${id}-input`}
          />
        </div>
      </div>
      
      {error && (
        <div 
          className="flex items-center gap-2 text-destructive text-sm mt-2" 
          role="alert" 
          aria-live="assertive"
        >
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      
      {showSelectedFiles && selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2" aria-label="Selected files">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Selected files:</p>
          <ul aria-label={`${selectedFiles.length} files selected`}>
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-md p-2 text-sm">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">{formatFileSize(file.size)}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => removeFile(file.name)}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
