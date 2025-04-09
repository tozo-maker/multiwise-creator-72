
import React, { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Upload, File, X } from 'lucide-react';
import { ProjectData } from '../hooks/useProjectWizard';

interface KnowledgeBaseStepProps {
  data: ProjectData;
  updateData: (data: Partial<ProjectData>) => void;
  isMobile?: boolean;
}

export function KnowledgeBaseStep({ data, updateData, isMobile = false }: KnowledgeBaseStepProps) {
  const [enableKnowledgeBase, setEnableKnowledgeBase] = useState(data.hasKnowledgeBase || false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleKnowledgeBase = (enabled: boolean) => {
    setEnableKnowledgeBase(enabled);
    updateData({ hasKnowledgeBase: enabled });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      updateData({ 
        knowledgeBaseFiles: updatedFiles.map(file => file.name),
        hasKnowledgeBase: true 
      });
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const updatedFiles = [...files, ...droppedFiles];
      setFiles(updatedFiles);
      updateData({ 
        knowledgeBaseFiles: updatedFiles.map(file => file.name),
        hasKnowledgeBase: true 
      });
    }
  };
  
  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    updateData({ 
      knowledgeBaseFiles: updatedFiles.map(file => file.name),
      hasKnowledgeBase: updatedFiles.length > 0 
    });
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleBrowseFilesClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 p-4">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-500 mt-0.5" />
        <div>
          <h3 className="font-medium text-amber-800 dark:text-amber-500">Knowledge Base (Optional)</h3>
          <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
            Upload reference documents to improve content generation. This step is optional and can be configured later.
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="knowledgeBase" className="text-slate-900 dark:text-slate-200">
            Enable Knowledge Base
          </Label>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add reference materials for your project
          </p>
        </div>
        <Switch
          id="knowledgeBase"
          checked={enableKnowledgeBase}
          onCheckedChange={toggleKnowledgeBase}
        />
      </div>
      
      {enableKnowledgeBase && (
        <Card className="border border-slate-200 dark:border-slate-700 p-4">
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-900/10"
                  : "border-slate-300 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="fileUpload"
                ref={fileInputRef}
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt,.md"
              />
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <Upload className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200 mb-1">
                  Drag and drop files, or
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBrowseFilesClick}
                  className="mt-2"
                >
                  Browse Files
                </Button>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  Supports PDF, DOCX, TXT, MD (Max 5MB per file)
                </p>
              </div>
            </div>
            
            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">Uploaded Files</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-md p-3">
                      <div className="flex items-center">
                        <File className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate max-w-[200px]">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
