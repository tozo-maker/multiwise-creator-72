
import React, { useMemo } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { NewProjectButton } from '@/components/projects/NewProjectButton';
import { useTheme } from '@/contexts/ThemeContext';
import { Project } from '@/types/supabase-custom';

type SortOrder = 'newest' | 'oldest' | 'progress' | 'name';

interface ProjectListHeaderProps {
  projects: Project[];
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

export const ProjectListHeader: React.FC<ProjectListHeaderProps> = React.memo(({ 
  projects, 
  filterType, 
  setFilterType, 
  sortOrder, 
  setSortOrder 
}) => {
  const { isDark } = useTheme();
  
  // Get unique project types for filter
  const projectTypes = useMemo(() => {
    const types = ['all_types']; // Changed from 'All Types' to 'all_types' to avoid empty string issues
    const uniqueTypes = new Set<string>();
    
    projects.forEach(project => {
      if (project.type && !uniqueTypes.has(project.type)) {
        uniqueTypes.add(project.type);
      }
    });
    
    return [...types, ...Array.from(uniqueTypes)];
  }, [projects]);
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div>
          <Label 
            htmlFor="filter-type" 
            className={`text-xs mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            Filter by Type
          </Label>
          <Select 
            value={filterType || 'all_types'} 
            onValueChange={(value) => setFilterType(value === 'all_types' ? null : value)}
          >
            <SelectTrigger id="filter-type" className="h-9">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map(type => (
                <SelectItem key={type} value={type}>{type === 'all_types' ? 'All Types' : type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label 
            htmlFor="sort-order" 
            className={`text-xs mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            Sort By
          </Label>
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
            <SelectTrigger id="sort-order" className="h-9">
              <SelectValue placeholder="Newest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <NewProjectButton />
    </div>
  );
});

ProjectListHeader.displayName = 'ProjectListHeader';
