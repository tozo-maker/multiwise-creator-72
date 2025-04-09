
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface FileTypeIconProps {
  fileType: string;
}

export const FileTypeIcon: React.FC<FileTypeIconProps> = ({ fileType }) => {
  const type = fileType.toLowerCase();
  
  switch (type) {
    case 'pdf':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">PDF</Badge>;
    case 'docx':
    case 'doc':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">DOC</Badge>;
    case 'txt':
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">TXT</Badge>;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">IMG</Badge>;
    case 'mp4':
    case 'webm':
    case 'avi':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">VID</Badge>;
    default:
      return <Badge variant="outline">{type.toUpperCase()}</Badge>;
  }
};
