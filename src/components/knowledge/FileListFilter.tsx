
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Filter } from 'lucide-react';

interface FileListFilterProps {
  categories: string[];
  categoryFilter: string | null;
  onCategoryFilterChange: (category: string | null) => void;
  tags?: string[];
  tagFilter?: string | null;
  onTagFilterChange?: (tag: string | null) => void;
}

export const FileListFilter: React.FC<FileListFilterProps> = ({
  categories,
  categoryFilter,
  onCategoryFilterChange,
  tags = [],
  tagFilter = null,
  onTagFilterChange
}) => {
  // Filter out empty categories
  const validCategories = categories.filter(cat => cat && cat !== '');
  
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex flex-col w-full md:w-48 gap-2">
          <Label htmlFor="category-filter" className="text-xs">Filter by Category</Label>
          <Select 
            value={categoryFilter || 'all'} 
            onValueChange={value => onCategoryFilterChange(value === 'all' ? null : value)}
          >
            <SelectTrigger id="category-filter" className="h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {validCategories.map((category, index) => (
                <SelectItem key={index} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {tags && tags.length > 0 && onTagFilterChange && (
          <div className="flex flex-col w-full md:w-48 gap-2">
            <Label htmlFor="tag-filter" className="text-xs">Filter by Tag</Label>
            <Select 
              value={tagFilter || 'all'} 
              onValueChange={value => onTagFilterChange(value === 'all' ? null : value)}
            >
              <SelectTrigger id="tag-filter" className="h-9">
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {tags.map((tag, index) => (
                  <SelectItem key={index} value={tag}>
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3 w-3" /> {tag}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="flex items-end space-x-2">
        {(categoryFilter || tagFilter) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onCategoryFilterChange(null);
              if (onTagFilterChange) onTagFilterChange(null);
            }}
            className="h-9"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
        
        {tagFilter && onTagFilterChange && (
          <Badge className="h-6 px-2 bg-slate-200 text-slate-700 hover:bg-slate-300 flex items-center gap-1">
            {tagFilter}
            <button
              onClick={() => onTagFilterChange(null)}
              className="ml-1 text-slate-500 hover:text-slate-700 rounded-full"
            >
              ×
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
};
