
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, Upload, File, Check, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface KnowledgeBaseStepProps {
  data: Record<string, any>;
  updateData: (data: Record<string, any>) => void;
  isMobile?: boolean;
}

export function KnowledgeBaseStep({ data, updateData, isMobile = false }: KnowledgeBaseStepProps) {
  const [useKnowledgeBase, setUseKnowledgeBase] = useState(false);
  const [files, setFiles] = useState<{name: string, size: string, status: string}[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: formatFileSize(file.size),
        status: 'waiting'
      }));
      
      setFiles([...files, ...newFiles]);
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    
    // Update all files to uploading status
    setFiles(files.map(file => ({ ...file, status: 'uploading' })));
    
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setUploading(false);
          
          // Mark all files as completed
          setFiles(files.map(file => ({ ...file, status: 'completed' })));
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base font-medium">Initialize Knowledge Base</Label>
          <p className="text-sm text-muted-foreground">
            Upload documents to pre-populate your project's knowledge base
          </p>
        </div>
        <Switch 
          checked={useKnowledgeBase} 
          onCheckedChange={setUseKnowledgeBase} 
        />
      </div>
      
      {useKnowledgeBase && (
        <>
          <Card className="border-dashed border-2 cursor-pointer hover:bg-slate-50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-6 text-center">
              <Upload className="h-8 w-8 text-slate-400 mb-2" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Drop files here or click to upload</p>
                <p className="text-xs text-muted-foreground">
                  Support for PDF, DOCX, TXT, and other document formats
                </p>
              </div>
              <Button variant="outline" className="mt-4" onClick={() => document.getElementById('file-upload')?.click()}>
                Select Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </CardContent>
          </Card>
          
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Files to upload</Label>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center space-x-2">
                        <File className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {file.size}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        {file.status === 'completed' ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
              
              {!uploading && files.some(file => file.status !== 'completed') && (
                <Button 
                  onClick={simulateUpload}
                  className="bg-brand-500 hover:bg-brand-600 w-full"
                >
                  Upload {files.length} file{files.length !== 1 ? 's' : ''}
                </Button>
              )}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            <p>The knowledge base helps tailor content to your specific needs.</p>
            <p>You can always add more documents to your knowledge base later.</p>
          </div>
        </>
      )}
      
      {!useKnowledgeBase && (
        <Card>
          <CardContent className="pt-4 text-sm">
            <p>You can set up your knowledge base later from the project workspace.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
