
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Upload } from 'lucide-react';
import { FileDropzone } from '@/components/upload/FileDropzone';

interface KnowledgeBaseStepProps {
  data: {
    hasKnowledgeBase?: boolean;
    knowledgeBaseFiles?: string[];
  };
  updateData: (data: Partial<typeof KnowledgeBaseStepProps.prototype.data>) => void;
  isMobile?: boolean;
}

export function KnowledgeBaseStep({ data, updateData, isMobile = false }: KnowledgeBaseStepProps) {
  const [enableKnowledgeBase, setEnableKnowledgeBase] = useState(data.hasKnowledgeBase || false);
  const [files, setFiles] = useState<File[]>([]);

  const toggleKnowledgeBase = (enabled: boolean) => {
    setEnableKnowledgeBase(enabled);
    updateData({ hasKnowledgeBase: enabled });
  };
  
  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    updateData({ knowledgeBaseFiles: selectedFiles.map(f => f.name) });
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
        <Card className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-4">
          <div className="space-y-4">
            <FileDropzone 
              onFilesSelected={handleFilesSelected}
              maxFiles={5}
              accept=".pdf,.docx,.txt,.md"
              className="w-full"
            />
            
            {files.length === 0 && (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-200">No files uploaded</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Drag and drop files or use the button above
                </p>
              </div>
            )}
            
            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-200">Uploaded Files</h3>
                <ul className="divide-y divide-slate-200 dark:divide-slate-700 rounded-md border border-slate-200 dark:border-slate-700">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between py-2 px-4 text-sm">
                      <span className="truncate text-slate-700 dark:text-slate-300">{file.name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="text-sm text-slate-500 dark:text-slate-400">
              <p>You can also add knowledge base documents after creating your project.</p>
            </div>
          </div>
        </Card>
      )}
      
      {!enableKnowledgeBase && (
        <div className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-6 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Knowledge base is disabled. You can enable it later from the project settings.
          </p>
        </div>
      )}
    </div>
  );
}
