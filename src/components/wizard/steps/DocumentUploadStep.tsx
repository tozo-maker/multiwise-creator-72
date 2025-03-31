
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { File, X, Paperclip, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileDropzone } from '@/components/upload/FileDropzone';
import { FilePreview } from '@/components/upload/FilePreview';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DocumentUploadProps {
  data: {
    uploadedDocuments: { name: string; description: string; }[];
  };
  updateData: (data: { uploadedDocuments: { name: string; description: string; }[] }) => void;
}

export const DocumentUploadStep: React.FC<DocumentUploadProps> = ({ data, updateData }) => {
  const [fileDescription, setFileDescription] = useState('');
  const {
    files,
    error,
    addFiles,
    removeFile: removeSelectedFile,
    clearFiles
  } = useFileUpload({
    maxFiles: 1,
    maxSizeInMB: 15,
    acceptedTypes: ['.pdf', '.docx', '.doc', '.txt', '.rtf', '.md', '.csv', '.xlsx', '.xls']
  });

  const selectedFile = files.length > 0 ? files[0] : null;
  
  const handleFilesSelected = (newFiles: File[]) => {
    addFiles(newFiles);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const newDocument = {
        name: selectedFile.name,
        description: fileDescription,
      };
      
      updateData({
        uploadedDocuments: [...data.uploadedDocuments, newDocument]
      });
      
      // Reset state
      clearFiles();
      setFileDescription('');
    }
  };

  const removeFile = (fileName: string) => {
    updateData({
      uploadedDocuments: data.uploadedDocuments.filter(doc => doc.name !== fileName)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="documentUpload" className="text-base font-medium">Upload Custom Standards Document</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-slate-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Upload documents that contain your custom standards, templates, or reference materials. 
                These will be used to guide the AI in generating content according to your requirements.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {!selectedFile ? (
          <FileDropzone 
            onFilesSelected={handleFilesSelected}
            maxFiles={1}
            showSelectedFiles={false}
            accept=".pdf,.docx,.doc,.txt,.rtf,.md,.csv,.xlsx,.xls"
            className="border-brand-100 hover:border-brand-300 focus-within:border-brand-500"
            aria-labelledby="documentUpload"
          />
        ) : (
          <div className="border rounded-lg p-6 space-y-4 bg-slate-50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <FilePreview file={selectedFile} className="h-full" />
              </div>
              
              <div className="sm:col-span-2 space-y-4">
                <div className="w-full">
                  <Label htmlFor="fileDescription" className="block text-sm mb-1 text-left">File Description</Label>
                  <Textarea
                    id="fileDescription"
                    placeholder="Describe what this document contains..."
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    className="w-full resize-none"
                    rows={3}
                    aria-required="true"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    A clear description helps the system understand how to use this document.
                  </p>
                </div>
                
                <div className="flex space-x-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      clearFiles();
                      setFileDescription('');
                    }}
                    aria-label="Cancel file upload"
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-brand-500 hover:bg-brand-600 text-white"
                    onClick={handleUpload}
                    disabled={!selectedFile || !fileDescription.trim()}
                    aria-label="Upload file"
                  >
                    Upload File
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Upload Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      {data.uploadedDocuments.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Uploaded Documents</Label>
          <div className="space-y-2">
            {data.uploadedDocuments.map((doc, index) => (
              <Card key={index} className="bg-slate-50 hover:bg-slate-100 transition-colors">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Paperclip className="h-4 w-4 text-brand-500" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      {doc.description && (
                        <p className="text-xs text-slate-500 line-clamp-1">{doc.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(doc.name)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                    aria-label={`Remove file ${doc.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
