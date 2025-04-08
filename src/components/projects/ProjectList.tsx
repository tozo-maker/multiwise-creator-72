
import React, { useState, useMemo } from 'react';
import { ProjectCardProps } from './ProjectCard';
import { useDashboard } from '@/contexts/DashboardContext';
import { ProjectListContainer } from './list/ProjectListContainer';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectListProps {
  projects: ProjectCardProps[];
  isLoading?: boolean;
}

export const ProjectList: React.FC<ProjectListProps> = React.memo(({ 
  projects, 
  isLoading = false 
}) => {
  // Get existing search term from DashboardContext to avoid duplicating functionality
  const { searchTerm: globalSearchTerm } = useDashboard();
  const [filterType, setFilterType] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'progress'| 'name'>('newest');
  const { theme } = useTheme();
  
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
    <div aria-live="polite" aria-busy={isLoading} role="region" aria-label="Project list">
      <ProjectListContainer 
        projects={projects}
        isLoading={isLoading}
        filteredProjects={filteredProjects}
        filterType={filterType}
        setFilterType={setFilterType}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </div>
  );
});

ProjectList.displayName = 'ProjectList';
