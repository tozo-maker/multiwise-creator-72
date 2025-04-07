
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
    <div className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md dark:hover:shadow-slate-800/30">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Recent Projects</h2>
      </div>
      
      <DashboardProjectFilters />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2 dark:bg-slate-700" />
                <Skeleton className="h-4 w-1/2 mb-6 dark:bg-slate-700" />
                <Skeleton className="h-2 w-full mb-2 dark:bg-slate-700" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-4 w-1/4 dark:bg-slate-700" />
                  <Skeleton className="h-4 w-1/4 dark:bg-slate-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="show"
        >
          <ProjectList projects={filteredProjects} />
          
          {filteredProjects.length === 0 && (
            <motion.div 
              variants={itemAnimation}
              className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800/50 transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50"
            >
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">No projects found</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Try adjusting your filters</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};
