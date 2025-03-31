
import { useState, useRef, useCallback } from 'react';

interface FileUploadOptions {
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
  onUploadComplete?: (files: File[]) => void;
}

interface FileUploadState {
  files: File[];
  isUploading: boolean;
  error: string | null;
  progress: number;
}

export function useFileUpload({
  maxFiles = 10,
  maxSizeInMB = 10,
  acceptedTypes = ['*/*'],
  onUploadComplete
}: FileUploadOptions = {}) {
  const [state, setState] = useState<FileUploadState>({
    files: [],
    isUploading: false,
    error: null,
    progress: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback((files: File[]): File[] => {
    // Reset error
    setState(prev => ({ ...prev, error: null }));
    
    if (files.length === 0) return [];
    
    // Check number of files
    if (files.length + state.files.length > maxFiles) {
      setState(prev => ({
        ...prev,
        error: `You can only upload a maximum of ${maxFiles} files at once.`
      }));
      return [];
    }
    
    // Validate file size and type
    const validFiles = Array.from(files).filter(file => {
      // Check file size
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setState(prev => ({
          ...prev,
          error: `File "${file.name}" exceeds the maximum size of ${maxSizeInMB}MB.`
        }));
        return false;
      }
      
      // Check file type if accept is specified
      if (acceptedTypes.length > 0 && !acceptedTypes.includes('*/*')) {
        const fileType = file.type;
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        
        const isAccepted = acceptedTypes.some(type => {
          if (type === '*/*') return true;
          if (type.endsWith('/*') && fileType.startsWith(type.replace('/*', ''))) return true;
          return type === fileType || type === fileExtension;
        });
        
        if (!isAccepted) {
          setState(prev => ({
            ...prev,
            error: `File "${file.name}" is not a supported file type.`
          }));
          return false;
        }
      }
      
      return true;
    });
    
    return validFiles;
  }, [maxFiles, maxSizeInMB, acceptedTypes, state.files.length]);

  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles = validateFiles(newFiles);
    
    if (validFiles.length > 0) {
      setState(prev => ({
        ...prev,
        files: [...prev.files, ...validFiles],
      }));
      
      if (onUploadComplete) {
        onUploadComplete(validFiles);
      }
    }
  }, [validateFiles, onUploadComplete]);

  const removeFile = useCallback((fileName: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.filter(file => file.name !== fileName)
    }));
  }, []);

  const clearFiles = useCallback(() => {
    setState(prev => ({
      ...prev,
      files: [],
      error: null,
      progress: 0
    }));
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setState(prev => ({ ...prev, isUploading: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    }
  }, [addFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
      
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [addFiles]);

  return {
    fileInputRef,
    files: state.files,
    isUploading: state.isUploading,
    error: state.error,
    progress: state.progress,
    addFiles,
    removeFile,
    clearFiles,
    handleDrop,
    handleFileInputChange
  };
}
