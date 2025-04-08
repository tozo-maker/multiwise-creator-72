
import React, { useState, useMemo, useCallback } from 'react';
import { ProjectCardProps } from './ProjectCard';
import { useDashboard } from '@/contexts/DashboardContext';
import { ProjectListContainer } from './list/ProjectListContainer';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectListProps {
  projects: ProjectCardProps[];
  isLoading?: boolean;
  'aria-labelledby'?: string;
}

export const ProjectList: React.FC<ProjectListProps> = React.memo(({ 
  projects, 
  isLoading = false,
  'aria-labelledby': ariaLabelledBy 
}) => {
  // Get existing search term from DashboardContext to avoid duplicating functionality
  const { searchTerm: globalSearchTerm } = useDashboard();
  const [filterType, setFilterType] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'progress'| 'name'>('newest');
  const { isDark } = useTheme();
  
  const setFilterTypeCallback = useCallback((type: string | null) => {
    setFilterType(type);
  }, []);

  const setSortOrderCallback = useCallback((order: 'newest' | 'oldest' | 'progress'| 'name') => {
    setSortOrder(order);
  }, []);
  
  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => 
        project.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) &&
        (filterType === null || project.type === filterType)
      )
      .sort((a, b) => {
        switch (sortOrder) {
          case 'newest':
            return parseInt(b.id) - parseInt(a.id);
          case 'oldest':
            return parseInt(a.id) - parseInt(b.id);
          case 'progress':
            return b.progress - a.progress;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [projects, globalSearchTerm, filterType, sortOrder]);
  
  return (
    <div 
      aria-live="polite" 
      aria-busy={isLoading}
      role="region"
      aria-labelledby={ariaLabelledBy}
      className="focus-within:outline-none"
    >
      <ProjectListContainer 
        projects={projects}
        isLoading={isLoading}
        filteredProjects={filteredProjects}
        filterType={filterType}
        setFilterType={setFilterTypeCallback}
        sortOrder={sortOrder}
        setSortOrder={setSortOrderCallback}
      />
    </div>
  );
});

ProjectList.displayName = 'ProjectList';
