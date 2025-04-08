
import React, { useMemo } from 'react';
import { ProjectList } from '@/components/projects/ProjectList';
import { DashboardProjectFilters } from '@/components/dashboard/DashboardProjectFilters';
import { useDashboard } from '@/contexts/DashboardContext';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeCard } from '@/components/shared/ThemeCard';

export const DashboardProjectSection: React.FC = React.memo(() => {
  const { filteredProjects, isLoading } = useDashboard();
  const { isDark } = useTheme();

  const sectionAnimation = useMemo(() => ({
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemAnimation = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }), []);

  if (isLoading) {
    return (
      <ThemeCard className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </ThemeCard>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="recent-projects-heading"
    >
      <ThemeCard className="p-6 rounded-xl">
        <div className="mb-4">
          <h2 
            id="recent-projects-heading"
            className={`text-xl font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
          >
            Recent Projects
          </h2>
        </div>
        
        <DashboardProjectFilters />
        
        <ProjectList 
          projects={filteredProjects} 
          isLoading={isLoading} 
          aria-labelledby="recent-projects-heading"
        />
      </ThemeCard>
    </motion.div>
  );
});

DashboardProjectSection.displayName = 'DashboardProjectSection';
