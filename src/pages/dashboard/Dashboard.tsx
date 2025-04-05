
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardWelcome } from '@/components/dashboard/DashboardWelcome';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardProjectSection } from '@/components/dashboard/DashboardProjectSection';
import { DashboardActivityTimeline } from '@/components/dashboard/DashboardActivityTimeline';
import { DashboardQuickActions } from '@/components/dashboard/DashboardQuickActions';
import { InteractiveHelp } from '@/components/dashboard/InteractiveHelp';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  return (
    <MainLayout contentWidth="wide">
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </MainLayout>
  );
};

// Separated component to use hooks within the DashboardProvider context
const DashboardContent = () => {
  const { isFirstVisit, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
          <p className="text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
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
          hasProjects={true}
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <DashboardProjectSection />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="space-y-8">
            <DashboardQuickActions hasProjects={true} className="border-slate-200 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-slate-50" />
            
            <DashboardActivityTimeline className="border-slate-200 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-slate-50" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
