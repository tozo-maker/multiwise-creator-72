
import React, { useState } from 'react';
import { KnowledgeBaseUpload } from '@/components/knowledge/KnowledgeBaseUpload';
import { Button } from '@/components/ui/button';
import { ConfigData } from '../types';
import { DocumentInsightIntegration } from './DocumentInsightIntegration';

interface DocumentUploadStepProps {
  data: ConfigData;
  updateData: (data: Partial<ConfigData>) => void;
}

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ 
  data, 
  updateData 
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>(data.uploadedDocuments || []);
  
  const handleFilesUploaded = (newFiles: any[]) => {
    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    updateData({ uploadedDocuments: updatedFiles });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Upload Knowledge Base Documents</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload documents that provide context for your project. These will be analyzed to enhance content generation.
        </p>
        
        <div className="bg-slate-50 border border-slate-200 rounded-md p-6">
          <KnowledgeBaseUpload onFilesUploaded={handleFilesUploaded} />
          
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Uploaded Documents ({uploadedFiles.length})</h3>
              <ul className="space-y-1">
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="text-sm text-slate-600 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Document analysis insights integration */}
      <DocumentInsightIntegration data={data} updateData={updateData} />
    </div>
  );
};
