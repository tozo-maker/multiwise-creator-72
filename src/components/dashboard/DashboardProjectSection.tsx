
import React from 'react';
import { ProjectList } from '@/components/projects/ProjectList';
import { DashboardProjectFilters } from '@/components/dashboard/DashboardProjectFilters';
import { useDashboard } from '@/contexts/DashboardContext';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export const DashboardProjectSection: React.FC = () => {
  const { filteredProjects, isLoading } = useDashboard();

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md dark:hover:shadow-slate-800/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Recent Projects</h2>
      </div>
      
      <DashboardProjectFilters />
      
      <ProjectList 
        projects={filteredProjects} 
        isLoading={isLoading} 
      />
    </motion.div>
  );
};
