
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { KBFile } from './KnowledgeBaseFileList';

export interface SortButtonProps {
  field?: keyof KBFile;
  label: string;
  active: boolean;  // This was missing
  direction: 'asc' | 'desc';
  onClick: () => void;
  sortField?: keyof KBFile;
  onSort?: (field: keyof KBFile) => void;
}

export const SortButton: React.FC<SortButtonProps> = ({
  field,
  label,
  active,
  direction,
  onClick,
  sortField,
  onSort
}) => {
  const handleClick = () => {
    if (field && onSort) {
      onSort(field);
    } else {
      onClick();
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8 gap-1 font-medium" 
      onClick={handleClick}
    >
      {label}
      {active && (
        <ArrowUpDown className={`h-3 w-3 ${direction === 'asc' ? 'rotate-180' : ''}`} />
      )}
    </Button>
  );
};
