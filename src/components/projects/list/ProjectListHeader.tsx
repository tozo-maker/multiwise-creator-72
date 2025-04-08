
import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ProjectCardProps } from '../ProjectCard';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectListHeaderProps {
  projects: ProjectCardProps[];
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  sortOrder: 'newest' | 'oldest' | 'progress' | 'name';
  setSortOrder: (order: 'newest' | 'oldest' | 'progress' | 'name') => void;
}

export const ProjectListHeader: React.FC<ProjectListHeaderProps> = ({
  projects,
  filterType,
  setFilterType,
  sortOrder,
  setSortOrder
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Get unique project types
  const projectTypes = Array.from(new Set(projects.map(project => project.type)));
  
  return (
    <div className="flex flex-wrap justify-between items-center mb-4">
      <div className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        {projects.length} project{projects.length !== 1 ? 's' : ''}
      </div>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className={`gap-1 ${
                isDark 
                  ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' 
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}>
            <DropdownMenuLabel className={isDark ? 'text-slate-300' : 'text-slate-700'}>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator className={isDark ? 'bg-slate-700' : 'bg-slate-200'} />
            <DropdownMenuCheckboxItem
              checked={filterType === null}
              onCheckedChange={() => setFilterType(null)}
              className={isDark ? 'text-slate-300 focus:bg-slate-700' : 'text-slate-700 focus:bg-slate-100'}
            >
              All Types
            </DropdownMenuCheckboxItem>
            
            {projectTypes.map(type => (
              <DropdownMenuCheckboxItem 
                key={type}
                checked={filterType === type}
                onCheckedChange={() => {
                  setFilterType(filterType === type ? null : type);
                }}
                className={isDark ? 'text-slate-300 focus:bg-slate-700' : 'text-slate-700 focus:bg-slate-100'}
              >
                {type}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className={`gap-1 ${
                isDark 
                  ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' 
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}>
            <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
              <DropdownMenuRadioItem 
                value="newest"
                className={isDark ? 'text-slate-300 focus:bg-slate-700' : 'text-slate-700 focus:bg-slate-100'}
              >
                Newest First
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem 
                value="oldest"
                className={isDark ? 'text-slate-300 focus:bg-slate-700' : 'text-slate-700 focus:bg-slate-100'}
              >
                Oldest First
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem 
                value="progress"
                className={isDark ? 'text-slate-300 focus:bg-slate-700' : 'text-slate-700 focus:bg-slate-100'}
              >
                Progress (High-Low)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem 
                value="name"
                className={isDark ? 'text-slate-300 focus:bg-slate-700' : 'text-slate-700 focus:bg-slate-100'}
              >
                Name (A-Z)
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
