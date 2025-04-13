import React, { useMemo, useEffect, useState } from 'react';
import { DashboardWelcome } from '@/components/dashboard/DashboardWelcome';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { InteractiveHelp } from '@/components/dashboard/InteractiveHelp';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { DashboardLoading } from '@/components/dashboard/DashboardLoading';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  return (
    <DashboardProvider>
      <DashboardLayout 
        contentWidth="wide" 
        pageTitle="Dashboard" 
        pageDescription="Welcome to your MultiGuide Dashboard"
        mainId="dashboard-main"
      >
        <DashboardContent />
      </DashboardLayout>
    </DashboardProvider>
  );
};

// Separated component to use hooks within the DashboardProvider context
const DashboardContent = () => {
  const { isFirstVisit, isLoading, filteredProjects, isDemo, refreshProjects, refreshError } = useDashboard();
  const { user } = useAuth();
  const { toast } = useToast();
  const [refreshState, setRefreshState] = useState({
    isRefreshing: false,
    lastRefreshed: null as Date | null
  });
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Memoize the hasProjects value to prevent unnecessary rerenders
  const hasProjects = useMemo(() => filteredProjects.length > 0, [filteredProjects]);

  // Effect to handle initial data loading
  useEffect(() => {
    if (!isLoading && user) {
      // Check if we should refresh data on mount
      const lastRefresh = localStorage.getItem('dashboard_last_refresh');
      const shouldRefresh = !lastRefresh || 
        (Date.now() - new Date(lastRefresh).getTime()) > 5 * 60 * 1000; // 5 minutes
      
      if (shouldRefresh) {
        handleRefreshDashboard();
      }
    }
  }, [user, isLoading]);

  // Set a timeout for loading
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setLoadingTimeout(true);
      }, 10000);
      
      return () => clearTimeout(timeout);
    } else {
      setLoadingTimeout(false);
    }
  }, [isLoading]);

  const handleRefreshDashboard = async () => {
    if (refreshState.isRefreshing) return;
    
    setRefreshState(prev => ({ ...prev, isRefreshing: true }));
    try {
      await refreshProjects();
      
      // Update last refresh time
      const now = new Date();
      localStorage.setItem('dashboard_last_refresh', now.toISOString());
      setRefreshState({ isRefreshing: false, lastRefreshed: now });
      
      toast({
        title: "Dashboard refreshed",
        description: "Your dashboard data has been updated",
        variant: "default",
      });
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      toast({
        title: "Refresh failed",
        description: "Failed to update dashboard data",
        variant: "destructive",
      });
    } finally {
      setRefreshState(prev => ({ ...prev, isRefreshing: false }));
    }
  };

  // Function to handle manual refresh
  const handleManualRefresh = () => {
    handleRefreshDashboard();
  };

  if (isLoading) {
    return <DashboardLoading />;
  }

  // Show error if there's a refresh error or loading timeout
  if (refreshError || loadingTimeout) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6">
        <Alert variant="destructive" className="mb-6 w-full max-w-md">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            {refreshError || "There was a problem loading your dashboard data."}
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={handleManualRefresh} 
          className="flex items-center gap-2"
          variant="outline"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry Loading</span>
        </Button>
      </div>
    );
  }

  // Get default username for non-authenticated users
  const userName = user ? (user.email?.split('@')[0] || "User") : "Guest";

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {isFirstVisit && (
          <motion.div
            key="welcome-alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Alert variant="default" className="bg-brand-50 text-brand-800 border-brand-200">
              <CheckCircle2 className="h-4 w-4 text-brand-500" />
              <AlertDescription>
                Welcome to MultiWise Creator! This platform helps you create educational content efficiently.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      
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
        <DashboardStats onRefresh={handleRefreshDashboard} isRefreshing={refreshState.isRefreshing} />
      </motion.div>
      
      <DashboardGrid hasProjects={hasProjects} />
    </div>
  );
};

export default Dashboard;
