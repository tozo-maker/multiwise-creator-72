
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface FileListFilterProps {
  categories: string[];
  categoryFilter: string | null;
  onCategoryFilterChange: (category: string | null) => void;
}

export const FileListFilter: React.FC<FileListFilterProps> = ({
  categories,
  categoryFilter,
  onCategoryFilterChange
}) => {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-end mb-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Filter className="h-4 w-4" />
            {categoryFilter ? categoryFilter : "All Categories"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onCategoryFilterChange(null)}>
            All Categories
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {categories.map(category => (
            <DropdownMenuItem 
              key={category} 
              onClick={() => onCategoryFilterChange(category)}
            >
              {category}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
