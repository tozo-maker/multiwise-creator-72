
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { KBFile } from './KnowledgeBaseFileList';

interface SortButtonProps {
  field: keyof KBFile;
  label: string;
  sortField: keyof KBFile;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof KBFile) => void;
}

export const SortButton: React.FC<SortButtonProps> = ({
  field,
  label,
  sortField,
  sortDirection,
  onSort
}) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8 gap-1 font-medium" 
      onClick={() => onSort(field)}
    >
      {label}
      {sortField === field && (
        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
      )}
    </Button>
  );
};
