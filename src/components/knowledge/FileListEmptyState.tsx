
import React from 'react';
import { FileText } from 'lucide-react';

export const FileListEmptyState: React.FC = () => {
  return (
    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300 mx-[24px]">
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-slate-100">
        <FileText className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-1">No files in Knowledge Base</h3>
      <p className="text-slate-500 mb-4">Upload files to enhance your project with specific context</p>
    </div>
  );
};
