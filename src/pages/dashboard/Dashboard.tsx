
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardWelcome } from '@/components/dashboard/DashboardWelcome';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { DashboardProjectSection } from '@/components/dashboard/DashboardProjectSection';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardActivityTimeline } from '@/components/dashboard/DashboardActivityTimeline';
import { DashboardAIInsights } from '@/components/dashboard/DashboardAIInsights';
import { DashboardLoading } from '@/components/dashboard/DashboardLoading';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile, authError, retryAuthentication } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Current user info for debugging
  useEffect(() => {
    if (user) {
      console.log('Current user:', user.email);
    }
  }, [user]);
  
  const handleRetryAuth = async () => {
    if (retryAuthentication) {
      const success = await retryAuthentication();
      
      if (success) {
        toast({
          title: "Connection Restored",
          description: "Your authentication issue has been resolved",
        });
      }
    }
  };
  
  if (isLoading) {
    return <DashboardLoading />;
  }
  
  const username = profile?.name || profile?.username || user?.email?.split('@')[0] || 'User';
  
  const renderAuthError = () => {
    if (!authError) return null;
    
    return (
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 dark:bg-amber-900/20 dark:border-amber-800">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 text-amber-500 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Authentication Issue</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              There might be a problem with the authentication service.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto bg-white text-amber-700 border-amber-300 hover:bg-amber-50 hover:text-amber-800 dark:bg-amber-800/30 dark:border-amber-700 dark:text-amber-300"
            onClick={handleRetryAuth}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {renderAuthError()}
        <DashboardWelcome username={username} />
        <DashboardGrid>
          <DashboardStats />
          <DashboardProjectSection />
          <DashboardActivityTimeline />
          <DashboardAIInsights />
        </DashboardGrid>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
