
import React, { useMemo } from 'react';
import { DashboardWelcome } from '@/components/dashboard/DashboardWelcome';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { InteractiveHelp } from '@/components/dashboard/InteractiveHelp';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { DashboardLoading } from '@/components/dashboard/DashboardLoading';
import { DashboardLayout as DashboardContentLayout } from '@/components/dashboard/DashboardLayout';
import { useDashboard } from '@/contexts/DashboardContext';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout 
      contentWidth="wide" 
      pageTitle="Dashboard" 
      pageDescription="Welcome to your MultiGuide Dashboard"
      mainId="dashboard-main"
    >
      <DashboardContent />
    </DashboardLayout>
  );
};

// Separated component to use hooks within the DashboardProvider context
const DashboardContent = () => {
  const { isFirstVisit, isLoading, filteredProjects } = useDashboard();
  
  // Memoize the hasProjects value to prevent unnecessary rerenders
  const hasProjects = useMemo(() => filteredProjects.length > 0, [filteredProjects]);

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardWelcome 
          userName="John"
          hasProjects={hasProjects}
          className="mb-8"
        />
      </motion.div>
      
      {isFirstVisit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <InteractiveHelp isNew={true} className="mb-8" />
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DashboardStats />
      </motion.div>
      
      <DashboardGrid hasProjects={hasProjects} />
    </div>
  );
};

export default Dashboard;
