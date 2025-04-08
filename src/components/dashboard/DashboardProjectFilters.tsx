
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
    <div className={cn("flex justify-end items-center gap-3 mb-6", className)}>
      <div className="flex items-center gap-2">
        {isFiltersActive && (
          <Badge 
            variant="outline" 
            className={`${
              isDark 
                ? 'bg-slate-700 dark:text-slate-200 hover:bg-slate-600' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            } cursor-pointer`}
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
                `h-10 gap-2 ${
                  isDark 
                    ? 'border-slate-700 text-slate-200 hover:border-brand-700 hover:bg-brand-900/20' 
                    : 'border-slate-200 text-slate-700 hover:border-brand-200 hover:bg-brand-50'
                } transition-all`,
                isFiltersActive && `${
                  isDark 
                    ? 'bg-brand-900/20 border-brand-700 text-brand-300' 
                    : 'bg-brand-50 border-brand-200 text-brand-700'
                }`
              )}
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={`w-56 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <DropdownMenuLabel className={isDark ? 'text-slate-200' : 'text-slate-700'}>
              Filter Projects
            </DropdownMenuLabel>
            <DropdownMenuSeparator className={isDark ? 'bg-slate-700' : 'bg-slate-200'} />
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className={`${
                isDark ? 'text-slate-200 focus:bg-slate-700' : 'text-slate-700 focus:bg-slate-100'
              }`}>
                <span>Project Type</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className={`${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  {projectTypes.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={filterType === type}
                      onCheckedChange={() => handleFilterChange(type)}
                      className={`${
                        isDark ? 'text-slate-200 focus:bg-slate-700' : 'text-slate-700 focus:bg-slate-100'
                      }`}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className={`${
                isDark ? 'text-slate-200 focus:bg-slate-700' : 'text-slate-700 focus:bg-slate-100'
              }`}>
                <span>Language</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className={`${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  {languages.map((language) => (
                    <DropdownMenuCheckboxItem
                      key={language}
                      checked={filterLanguage === language}
                      onCheckedChange={() => handleLanguageChange(language)}
                      className={`${
                        isDark ? 'text-slate-200 focus:bg-slate-700' : 'text-slate-700 focus:bg-slate-100'
                      }`}
                    >
                      {language}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            
            <DropdownMenuSeparator className={isDark ? 'bg-slate-700' : 'bg-slate-200'} />
            
            <div className="px-2 py-1.5 flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Active Projects Only
              </span>
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
                `h-10 gap-2 ${
                  isDark 
                    ? 'border-slate-700 text-slate-200 hover:border-brand-700 hover:bg-brand-900/20' 
                    : 'border-slate-200 text-slate-700 hover:border-brand-200 hover:bg-brand-50'
                } transition-all`,
                isSortActive && `${
                  isDark 
                    ? 'bg-brand-900/20 border-brand-700 text-brand-300' 
                    : 'bg-brand-50 border-brand-200 text-brand-700'
                }`
              )}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={`${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <DropdownMenuRadioGroup value={sortOrder} onValueChange={handleSortChange}>
              {sortOptions.map((option) => (
                <DropdownMenuRadioItem 
                  key={option.value} 
                  value={option.value}
                  className={`${
                    isDark ? 'text-slate-200 focus:bg-slate-700' : 'text-slate-700 focus:bg-slate-100'
                  }`}
                >
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
