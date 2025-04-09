
import React, { useState } from 'react';
import { FileText, Download, Trash2, MoreHorizontal, Edit, Eye, Search, Filter, ArrowUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  categories?: string[];
}
export const KnowledgeBaseFileList: React.FC<KnowledgeBaseFileListProps> = ({
  files,
  onDelete,
  onEdit,
  onPreview,
  onDownload,
  categories = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof KBFile>('uploadDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  if (files.length === 0) {
    return <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-slate-100">
          <FileText className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">No files in Knowledge Base</h3>
        <p className="text-slate-500 mb-4">Upload files to enhance your project with specific context</p>
      </div>;
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
  const toggleSort = (field: keyof KBFile) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const sortedFiles = [...files].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue === bValue) return 0;
    const comparison = aValue < bValue ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  const filteredFiles = sortedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) || file.description.toLowerCase().includes(searchTerm.toLowerCase()) || (file.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ?? false);
    const matchesCategory = categoryFilter ? file.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });
  const SortButton = ({
    field,
    label
  }: {
    field: keyof KBFile;
    label: string;
  }) => <Button variant="ghost" size="sm" className="h-8 gap-1 font-medium" onClick={() => toggleSort(field)}>
      {label}
      {sortField === field && <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
    </Button>;
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative w-full sm:w-64">
          
          
        </div>
        
        {categories.length > 0 && <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Filter className="h-4 w-4" />
                {categoryFilter ? categoryFilter : "All Categories"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map(category => <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                  {category}
                </DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton field="name" label="File Name" />
              </TableHead>
              <TableHead>
                <SortButton field="description" label="Description" />
              </TableHead>
              {categories.length > 0 && <TableHead>
                  <SortButton field="category" label="Category" />
                </TableHead>}
              <TableHead>
                <SortButton field="fileType" label="Type" />
              </TableHead>
              <TableHead>
                <SortButton field="size" label="Size" />
              </TableHead>
              <TableHead>
                <SortButton field="uploadDate" label="Upload Date" />
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles.length > 0 ? filteredFiles.map(file => <TableRow key={file.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-slate-500" />
                      <span>{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {file.description || "No description"}
                  </TableCell>
                  {categories.length > 0 && <TableCell>
                      {file.category ? <Badge variant="outline">{file.category}</Badge> : <span className="text-slate-400 text-sm">None</span>}
                    </TableCell>}
                  <TableCell>{getFileIcon(file.fileType)}</TableCell>
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
                </TableRow>) : <TableRow>
                <TableCell colSpan={categories.length > 0 ? 7 : 6} className="text-center py-6 text-slate-500">
                  No files match your search criteria
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center text-sm text-slate-500 mt-4">
        <div>
          Showing {filteredFiles.length} of {files.length} files
        </div>
        {searchTerm && <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')} className="h-8 text-xs">
            Clear Search
          </Button>}
      </div>
    </div>;
};
