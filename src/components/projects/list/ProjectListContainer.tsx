
import React from 'react';
import { ProjectCardProps } from '../ProjectCard';
import { ProjectListHeader } from './ProjectListHeader';
import { ProjectListContent } from './ProjectListContent';
import { ViewAllProjectsButton } from './ViewAllProjectsButton';
import { AnimatePresence, motion } from 'framer-motion';
import { EmptyProjectsList } from './EmptyProjectsList';
import { ProjectListSkeleton } from './ProjectListSkeleton';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeCard } from '@/components/shared/ThemeCard';

interface ProjectListContainerProps {
  projects: ProjectCardProps[];
  isLoading?: boolean;
  filteredProjects: ProjectCardProps[];
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  sortOrder: 'newest' | 'oldest' | 'progress' | 'name';
  setSortOrder: (order: 'newest' | 'oldest' | 'progress' | 'name') => void;
}

export const ProjectListContainer = React.memo(function ProjectListContainer({ 
  projects,
  isLoading = false,
  filteredProjects,
  filterType,
  setFilterType,
  sortOrder,
  setSortOrder
}: ProjectListContainerProps) {
  const { theme } = useTheme();
  
  if (isLoading) {
    return <ProjectListSkeleton />;
  }
  
  if (projects.length === 0) {
    return <EmptyProjectsList />;
  }

  const displayProjects = filteredProjects.slice(0, window.location.pathname === '/dashboard' ? 6 : filteredProjects.length);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <ThemeCard className="space-y-4 project-list-container p-4">
      <ProjectListHeader 
        projects={projects}
        filterType={filterType}
        setFilterType={setFilterType}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <AnimatePresence>
        {displayProjects.length === 0 ? (
          <EmptyProjectsList filtered />
        ) : (
          <ProjectListContent 
            projects={displayProjects} 
            containerVariants={containerVariants} 
          />
        )}
      </AnimatePresence>
      
      {window.location.pathname === '/dashboard' && projects.length > 6 && (
        <ViewAllProjectsButton projectCount={projects.length} />
      )}
    </ThemeCard>
  );
});
