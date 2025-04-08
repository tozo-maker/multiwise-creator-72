
import React, { useState } from 'react';
import { Filter, ArrowUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuPortal } from '@/components/ui/dropdown-menu';
import { useDashboard } from '@/contexts/DashboardContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';

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
  
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
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
    <div className={cn("flex flex-wrap gap-2 mb-4", className)}>
      {/* Filter dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={cn(
              "flex items-center gap-1",
              isFiltersActive && "bg-primary/10 border-primary/20"
            )}
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            {isFiltersActive && (
              <Badge variant="secondary" className="ml-1 h-5 px-1">
                {filterType !== 'All Types' && filterLanguage !== 'All Languages' 
                  ? '2' 
                  : '1'}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuLabel>Project Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Project Type</span>
              {filterType !== 'All Types' && (
                <Badge variant="secondary" className="ml-auto">
                  {filterType}
                </Badge>
              )}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {projectTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={filterType === type}
                    onCheckedChange={() => handleFilterChange(type)}
                  >
                    {type}
                    {filterType === type && <Check className="h-4 w-4 ml-auto" />}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Language</span>
              {filterLanguage !== 'All Languages' && (
                <Badge variant="secondary" className="ml-auto">
                  {filterLanguage}
                </Badge>
              )}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {languages.map((language) => (
                  <DropdownMenuCheckboxItem
                    key={language}
                    checked={filterLanguage === language}
                    onCheckedChange={() => handleLanguageChange(language)}
                  >
                    {language}
                    {filterLanguage === language && <Check className="h-4 w-4 ml-auto" />}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
          <DropdownMenuSeparator />
          
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-sm">Active Projects Only</span>
            <Switch
              checked={showActiveOnly}
              onCheckedChange={handleActiveToggle}
              aria-label="Toggle active projects only"
            />
          </div>
          
          {isFiltersActive && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={clearFilters}
              >
                Clear Filters
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Sort dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={cn(
              "flex items-center gap-1",
              isSortActive && "bg-primary/10 border-primary/20"
            )}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>Sort</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
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
  );
};
