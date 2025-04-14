
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileIcon } from 'lucide-react';
import { ConfigData } from '../../types';

interface ReferenceDocumentsProps {
  data: ConfigData;
}

export const ReferenceDocuments: React.FC<ReferenceDocumentsProps> = ({ data }) => {
  if (!data.uploadedDocuments || data.uploadedDocuments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Reference Documents</h3>
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <ul className="space-y-2">
            {data.uploadedDocuments.map((doc, index) => (
              <li key={index} className="flex items-center gap-2">
                <FileIcon className="h-4 w-4 text-slate-500" />
                <span>{doc.name}</span>
                {doc.description && (
                  <span className="text-sm text-slate-500">- {doc.description}</span>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
