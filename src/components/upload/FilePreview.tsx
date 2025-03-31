
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { File, FileText, Image, FileArchive, FileCode, FileQuestion } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, className }) => {
  const getFileIcon = () => {
    const fileType = file.type.split('/')[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    switch (fileType) {
      case 'image':
        return <Image className="h-10 w-10 text-slate-500" />;
      case 'application':
        if (file.type.includes('pdf')) {
          return <FileText className="h-10 w-10 text-red-500" />;
        } else if (
          file.type.includes('word') || 
          fileExtension === 'doc' || 
          fileExtension === 'docx'
        ) {
          return <FileText className="h-10 w-10 text-blue-500" />;
        } else if (
          file.type.includes('zip') || 
          file.type.includes('rar') || 
          fileExtension === 'zip' || 
          fileExtension === 'rar'
        ) {
          return <FileArchive className="h-10 w-10 text-yellow-500" />;
        } else if (
          fileExtension === 'js' || 
          fileExtension === 'html' || 
          fileExtension === 'css' || 
          fileExtension === 'json'
        ) {
          return <FileCode className="h-10 w-10 text-green-500" />;
        }
        return <FileText className="h-10 w-10 text-slate-500" />;
      case 'text':
        return <FileText className="h-10 w-10 text-slate-500" />;
      default:
        return <FileQuestion className="h-10 w-10 text-slate-500" />;
    }
  };

  const renderPreview = () => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="relative w-full h-32 overflow-hidden rounded-lg bg-slate-100">
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name}
            className="object-contain w-full h-full"
            onLoad={(e) => {
              // Revoke object URL when image is loaded to free memory
              URL.revokeObjectURL((e.target as HTMLImageElement).src);
            }}
          />
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg">
        {getFileIcon()}
        <span className="mt-2 text-sm font-medium text-slate-700 text-center truncate max-w-full">
          {file.name}
        </span>
        <span className="text-xs text-slate-500">
          {formatFileSize(file.size)}
        </span>
      </div>
    );
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-3">
        {renderPreview()}
      </CardContent>
    </Card>
  );
};
