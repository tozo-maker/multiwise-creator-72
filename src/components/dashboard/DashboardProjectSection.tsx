
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
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-slate-800">Recent Projects</h2>
      </div>
      
      <DashboardProjectFilters />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <Skeleton className="h-2 w-full mb-2" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
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
              className="text-center py-12 border border-dashed border-slate-300 rounded-lg bg-slate-50 transition-all hover:bg-slate-100"
            >
              <h3 className="text-lg font-medium text-slate-700">No projects found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your filters</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};
