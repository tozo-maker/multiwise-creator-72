
import React from 'react';
import { ProjectList } from '@/components/projects/ProjectList';
import { DashboardProjectFilters } from '@/components/dashboard/DashboardProjectFilters';
import { useDashboard } from '@/contexts/DashboardContext';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

export const DashboardProjectSection: React.FC = () => {
  const { filteredProjects, isLoading } = useDashboard();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
      className={`space-y-6 ${isDark ? 'bg-slate-800 dark:border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-xl shadow-sm border transition-all hover:shadow-md ${isDark ? 'dark:hover:shadow-slate-800/30' : 'hover:shadow-slate-200/50'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-2">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Recent Projects</h2>
      </div>
      
      <DashboardProjectFilters />
      
      <ProjectList 
        projects={filteredProjects} 
        isLoading={isLoading} 
      />
    </motion.div>
  );
};
