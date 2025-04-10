
import React, { useMemo } from 'react';
import { DashboardWelcome } from '@/components/dashboard/DashboardWelcome';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { InteractiveHelp } from '@/components/dashboard/InteractiveHelp';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { DashboardLoading } from '@/components/dashboard/DashboardLoading';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';

const Dashboard = () => {
  return (
    <DashboardLayout 
      contentWidth="wide" 
      pageTitle="Dashboard" 
      pageDescription="Welcome to your MultiGuide Dashboard"
      mainId="dashboard-main"
    >
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </DashboardLayout>
  );
};

// Separated component to use hooks within the DashboardProvider context
const DashboardContent = () => {
  const { isFirstVisit, isLoading, filteredProjects, isDemo } = useDashboard();
  const { user } = useAuth();
  
  // Memoize the hasProjects value to prevent unnecessary rerenders
  const hasProjects = useMemo(() => filteredProjects.length > 0, [filteredProjects]);

  if (isLoading) {
    return <DashboardLoading />;
  }

  // Get default username for non-authenticated users
  const userName = user ? (user.email?.split('@')[0] || "User") : "Guest";

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <DashboardWelcome 
            userName={userName}
            hasProjects={hasProjects}
          />
          
          {isDemo ? (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 ml-4">
              Demo Mode
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 ml-4">
              Live Data
            </Badge>
          )}
        </div>
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
