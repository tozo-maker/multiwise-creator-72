
import React from 'react';
import { motion } from 'framer-motion';
import { DashboardProjectSection } from './DashboardProjectSection';
import { DashboardAIInsights } from './DashboardAIInsights';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardActivityTimeline } from './DashboardActivityTimeline';
import { ProfileCompletionCard } from '@/components/auth/ProfileCompletionCard';
import { useAuthProfile } from '@/contexts/AuthProfileContext';

interface DashboardGridProps {
  hasProjects: boolean;
  children?: React.ReactNode;
}

export const DashboardGrid: React.FC<DashboardGridProps> = React.memo(({ hasProjects, children }) => {
  const { isProfileComplete } = useAuthProfile();
  
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
          {children ? children : <DashboardProjectSection />}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="space-y-8">
            {!isProfileComplete && (
              <ProfileCompletionCard />
            )}
            <DashboardQuickActions hasProjects={hasProjects} />
            <DashboardActivityTimeline />
          </div>
        </motion.div>
      </div>
    </>
  );
});

DashboardGrid.displayName = 'DashboardGrid';
