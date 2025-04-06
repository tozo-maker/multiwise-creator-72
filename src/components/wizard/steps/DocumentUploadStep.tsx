
import React from 'react';
import { ConfigData } from '../types';

interface DocumentUploadStepProps {
  data: Pick<ConfigData, 'uploadedDocuments' | 'needsDocumentUpload'>;
  updateData: (data: Partial<ConfigData>) => void;
}

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ data, updateData }) => {
  const handleAddDocument = (name: string, description: string) => {
    const newDocument = { name, description };
    updateData({
      uploadedDocuments: [...data.uploadedDocuments, newDocument]
    });
  };

  const handleRemoveDocument = (index: number) => {
    const updatedDocuments = [...data.uploadedDocuments];
    updatedDocuments.splice(index, 1);
    updateData({ uploadedDocuments: updatedDocuments });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Upload or link to documents and materials that will be used as reference for your educational content.
      </div>

      {/* Document upload UI would go here */}
      <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
        <p>Drag and drop files here or click to browse</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => handleAddDocument("Sample Document", "Example document for demonstration")}
        >
          Select Files
        </button>
      </div>

      {/* List of uploaded documents */}
      {data.uploadedDocuments.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Uploaded Documents</h3>
          <ul className="space-y-2">
            {data.uploadedDocuments.map((doc, index) => (
              <li key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-slate-500">{doc.description}</p>
                </div>
                <button
                  className="text-red-500"
                  onClick={() => handleRemoveDocument(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
