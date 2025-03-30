
import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, File, X, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface DocumentUploadProps {
  data: {
    uploadedDocuments: { name: string; description: string; }[];
  };
  updateData: (data: { uploadedDocuments: { name: string; description: string; }[] }) => void;
}

export const DocumentUploadStep: React.FC<DocumentUploadProps> = ({ data, updateData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileDescription, setFileDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? 'border-brand-500 bg-brand-50' : 'border-slate-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Upload className="h-6 w-6 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drag and drop your file, or <button 
                    className="text-brand-600 hover:text-brand-700 hover:underline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PDF, DOCX, DOC, TXT, RTF (Max 10MB)
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt,.rtf"
              />
            </div>
          ) : (
            <div className="space-y-4">
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
                  onClick={handleUpload}
                  className="bg-brand-500 hover:bg-brand-600"
                >
                  Upload File
                </Button>
              </div>
            </div>
          )}
        </div>
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
