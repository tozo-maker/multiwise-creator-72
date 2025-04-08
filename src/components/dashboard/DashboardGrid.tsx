
import React from 'react';
import { motion } from 'framer-motion';
import { DashboardProjectSection } from './DashboardProjectSection';
import { DashboardAIInsights } from './DashboardAIInsights';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardActivityTimeline } from './DashboardActivityTimeline';

interface DashboardGridProps {
  hasProjects: boolean;
}

export const DashboardGrid: React.FC<DashboardGridProps> = React.memo(({ hasProjects }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <DashboardAIInsights />
      </motion.div>

      <div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        role="region"
        aria-label="Dashboard content"
      >
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <DashboardProjectSection />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="space-y-8">
            <DashboardQuickActions hasProjects={hasProjects} />
            <DashboardActivityTimeline />
          </div>
        </motion.div>
      </div>
    </>
  );
});

DashboardGrid.displayName = 'DashboardGrid';
