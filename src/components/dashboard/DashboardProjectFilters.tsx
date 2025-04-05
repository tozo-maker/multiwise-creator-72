
import React, { useState } from 'react';
import { Filter, ArrowUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { useDashboard } from '@/contexts/DashboardContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface DashboardProjectFiltersProps {
  className?: string;
}

export const DashboardProjectFilters: React.FC<DashboardProjectFiltersProps> = ({ 
  className 
}) => {
  const { 
    filterType, 
    setFilterType,
    filterLanguage,
    setFilterLanguage,
    sortOrder,
    setSortOrder,
    showActiveOnly,
    setShowActiveOnly
  } = useDashboard();
  
  const [isFiltersActive, setIsFiltersActive] = useState(false);
  const [isSortActive, setIsSortActive] = useState(false);
  
  const projectTypes = ['All Types', 'Textbook', 'Workbook', 'Reference', 'Worksheet', 'Teacher Guide'];
  const languages = ['All Languages', 'Spanish', 'French', 'Chinese', 'German', 'English'];
  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
    { label: 'Progress (High-Low)', value: 'progress-desc' },
    { label: 'Progress (Low-High)', value: 'progress-asc' }
  ];

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    setIsFiltersActive(type !== 'All Types');
  };

  const handleLanguageChange = (language: string) => {
    setFilterLanguage(language);
    setIsFiltersActive(language !== 'All Languages' || filterType !== 'All Types');
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setIsSortActive(true);
  };

  const handleActiveToggle = (checked: boolean) => {
    setShowActiveOnly(checked);
    setIsFiltersActive(checked || filterType !== 'All Types' || filterLanguage !== 'All Languages');
  };

  const clearFilters = () => {
    setFilterType('All Types');
    setFilterLanguage('All Languages');
    setShowActiveOnly(false);
    setIsFiltersActive(false);
  };

  return (
    <div className={cn("flex justify-end items-center gap-3 mb-6", className)}>
      <div className="flex items-center gap-2">
        {isFiltersActive && (
          <Badge 
            variant="outline" 
            className="bg-slate-100 hover:bg-slate-200 cursor-pointer"
            onClick={clearFilters}
          >
            Clear Filters
          </Badge>
        )}
      </div>
      
      <div className="flex gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "h-10 gap-2 border-slate-200 transition-all hover:border-brand-200 hover:bg-brand-50",
                isFiltersActive && "bg-brand-50 border-brand-200 text-brand-700"
              )}
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white">
            <DropdownMenuLabel>Filter Projects</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Project Type</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-white">
                  {projectTypes.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={filterType === type}
                      onCheckedChange={() => handleFilterChange(type)}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Language</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-white">
                  {languages.map((language) => (
                    <DropdownMenuCheckboxItem
                      key={language}
                      checked={filterLanguage === language}
                      onCheckedChange={() => handleLanguageChange(language)}
                    >
                      {language}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            
            <DropdownMenuSeparator />
            
            <div className="px-2 py-1.5 flex items-center justify-between">
              <span className="text-sm">Active Projects Only</span>
              <Switch 
                checked={showActiveOnly} 
                onCheckedChange={handleActiveToggle} 
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "h-10 gap-2 border-slate-200 transition-all hover:border-brand-200 hover:bg-brand-50",
                isSortActive && "bg-brand-50 border-brand-200 text-brand-700"
              )}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuRadioGroup value={sortOrder} onValueChange={handleSortChange}>
              {sortOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
