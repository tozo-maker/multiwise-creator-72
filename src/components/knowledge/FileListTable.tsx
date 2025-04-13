
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KBFile } from './KnowledgeBaseFileList';
import { FileTypeIcon } from './FileTypeIcon';
import { SortButton } from './SortButton';
import { DocumentInsights } from './DocumentInsights';
import { Eye, Download, Pencil, Trash2, Tag } from 'lucide-react';

interface FileListTableProps {
  files: KBFile[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  onManageTags?: (file: KBFile) => void;
  categories?: string[];
  sortField: keyof KBFile;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: keyof KBFile) => void;
  projectId?: string;
}

export const FileListTable: React.FC<FileListTableProps> = ({
  files,
  onDelete,
  onEdit,
  onPreview,
  onDownload,
  onManageTags,
  sortField,
  sortDirection,
  onSortChange,
  projectId
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <SortButton 
                label="File" 
                active={sortField === 'name'}
                direction={sortField === 'name' ? sortDirection : 'asc'}
                onClick={() => onSortChange('name')}
              />
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">
              <SortButton 
                label="Size" 
                active={sortField === 'size'}
                direction={sortField === 'size' ? sortDirection : 'asc'}
                onClick={() => onSortChange('size')}
              />
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <SortButton 
                label="Date" 
                active={sortField === 'uploadDate'}
                direction={sortField === 'uploadDate' ? sortDirection : 'asc'}
                onClick={() => onSortChange('uploadDate')}
              />
            </TableHead>
            <TableHead className="hidden xl:table-cell">Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map(file => (
            <TableRow key={file.id}>
              <TableCell>
                <div className="flex items-start gap-3">
                  <FileTypeIcon fileType={file.fileType} />
                  <div className="space-y-1">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-slate-500 line-clamp-1">
                      {file.description || 'No description'}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{file.fileType.toUpperCase()}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{file.size}</TableCell>
              <TableCell className="hidden lg:table-cell">{file.uploadDate}</TableCell>
              <TableCell className="hidden xl:table-cell">
                {file.tags && file.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {file.tags.slice(0, 2).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {file.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{file.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm">No tags</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onPreview(file.id)}
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDownload(file.id)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  {onManageTags && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onManageTags(file)}
                      title="Manage Tags"
                    >
                      <Tag className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(file.id)}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(file.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {projectId && (
                  <DocumentInsights fileId={file.id} projectId={projectId} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
