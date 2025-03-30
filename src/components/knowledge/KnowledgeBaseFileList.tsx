
import React from 'react';
import { FileText, Download, Trash2, MoreHorizontal, Edit, Eye } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export interface KBFile {
  id: string;
  name: string;
  description: string;
  fileType: string;
  size: string;
  uploadDate: string;
  category?: string;
  tags?: string[];
}

interface KnowledgeBaseFileListProps {
  files: KBFile[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
}

export const KnowledgeBaseFileList: React.FC<KnowledgeBaseFileListProps> = ({
  files,
  onDelete,
  onEdit,
  onPreview,
  onDownload
}) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-slate-100">
          <FileText className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">No files in Knowledge Base</h3>
        <p className="text-slate-500 mb-4">Upload files to enhance your project with specific context</p>
      </div>
    );
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">PDF</Badge>;
      case 'docx':
      case 'doc':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">DOC</Badge>;
      case 'txt':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">TXT</Badge>;
      default:
        return <Badge variant="outline">{fileType.toUpperCase()}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-slate-500" />
                  <span>{file.name}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {file.description || "No description"}
              </TableCell>
              <TableCell>{getFileIcon(file.fileType)}</TableCell>
              <TableCell>{file.size}</TableCell>
              <TableCell>{file.uploadDate}</TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPreview(file.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDownload(file.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(file.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Description
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(file.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
