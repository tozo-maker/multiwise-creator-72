
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SortButton } from './SortButton';
import { FileTypeIcon } from './FileTypeIcon';
import { KBFile } from './KnowledgeBaseFileList';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface FileListTableProps {
  files: KBFile[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  categories?: string[];
  sortField: keyof KBFile;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: keyof KBFile) => void;
}

export const FileListTable: React.FC<FileListTableProps> = ({
  files,
  onDelete,
  onEdit,
  onPreview,
  onDownload,
  categories = [],
  sortField,
  sortDirection,
  onSortChange
}) => {
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortButton 
                field="name" 
                label="File Name" 
                sortField={sortField} 
                sortDirection={sortDirection}
                onSort={onSortChange}
              />
            </TableHead>
            <TableHead>
              <SortButton 
                field="description" 
                label="Description" 
                sortField={sortField} 
                sortDirection={sortDirection}
                onSort={onSortChange}
              />
            </TableHead>
            {categories.length > 0 && (
              <TableHead>
                <SortButton 
                  field="category" 
                  label="Category" 
                  sortField={sortField} 
                  sortDirection={sortDirection}
                  onSort={onSortChange}
                />
              </TableHead>
            )}
            <TableHead>
              <SortButton 
                field="fileType" 
                label="Type" 
                sortField={sortField} 
                sortDirection={sortDirection}
                onSort={onSortChange}
              />
            </TableHead>
            <TableHead>
              <SortButton 
                field="size" 
                label="Size" 
                sortField={sortField} 
                sortDirection={sortDirection}
                onSort={onSortChange}
              />
            </TableHead>
            <TableHead>
              <SortButton 
                field="uploadDate" 
                label="Upload Date" 
                sortField={sortField} 
                sortDirection={sortDirection}
                onSort={onSortChange}
              />
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.length > 0 ? (
            files.map(file => (
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
                {categories.length > 0 && (
                  <TableCell>
                    {file.category ? (
                      <Badge variant="outline">{file.category}</Badge>
                    ) : (
                      <span className="text-slate-400 text-sm">None</span>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <FileTypeIcon fileType={file.fileType} />
                </TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>{file.uploadDate}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onPreview(file.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDownload(file.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(file.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(file.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={categories.length > 0 ? 7 : 6} className="text-center py-6 text-slate-500">
                No files match your filter criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
