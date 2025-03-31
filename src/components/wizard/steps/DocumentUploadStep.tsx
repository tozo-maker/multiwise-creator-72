
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { File, X, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileDropzone } from '@/components/upload/FileDropzone';

interface DocumentUploadProps {
  data: {
    uploadedDocuments: { name: string; description: string; }[];
  };
  updateData: (data: { uploadedDocuments: { name: string; description: string; }[] }) => void;
}

export const DocumentUploadStep: React.FC<DocumentUploadProps> = ({ data, updateData }) => {
  const [fileDescription, setFileDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
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
      setSelectedFile(null);
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
        <Label className="block mb-2">Upload Custom Standards Document</Label>
        
        {!selectedFile ? (
          <FileDropzone 
            onFilesSelected={handleFilesSelected}
            maxFiles={1}
            showSelectedFiles={false}
          />
        ) : (
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <File className="h-5 w-5 text-brand-600" />
              <span className="font-medium text-brand-700">{selectedFile.name}</span>
            </div>
            
            <div className="w-full">
              <Label htmlFor="fileDescription" className="block text-sm mb-1 text-left">File Description</Label>
              <Textarea
                id="fileDescription"
                placeholder="Describe what this document contains..."
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex space-x-2 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                className="bg-brand-500 hover:bg-brand-600 text-white"
                onClick={handleUpload}
              >
                Upload File
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {data.uploadedDocuments.length > 0 && (
        <div className="space-y-3">
          <Label>Uploaded Documents</Label>
          <div className="space-y-2">
            {data.uploadedDocuments.map((doc, index) => (
              <Card key={index} className="bg-slate-50">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Paperclip className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      {doc.description && (
                        <p className="text-xs text-slate-500 line-clamp-1">{doc.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(doc.name)}
                    className="text-slate-400 hover:text-red-600"
                    aria-label="Remove file"
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
