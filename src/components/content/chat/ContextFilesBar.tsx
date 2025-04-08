
import React from 'react';
import { ContextFile } from './types';

interface ContextFilesBarProps {
  contextFiles: ContextFile[];
}

export const ContextFilesBar: React.FC<ContextFilesBarProps> = ({ contextFiles }) => {
  if (contextFiles.length === 0) return null;
  
  return (
    <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md">
      Using {contextFiles.length} file(s) as context: {contextFiles.map(f => f.name).join(', ')}
    </div>
  );
};
