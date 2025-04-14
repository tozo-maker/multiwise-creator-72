
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

export const PrivateRoute = () => {
  // Use auth context safely with fallback values
  const authContext = React.useContext(React.createContext<{user: any, isLoading: boolean} | null>(null));
  const { user, isLoading: authLoading } = authContext || { user: null, isLoading: true };
  
  const location = useLocation();
  const { toast } = useToast();
  const [isReady, setIsReady] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [criticalTimeout, setCriticalTimeout] = useState(false);
  
  useEffect(() => {
    // Small delay to prevent flash of loading state for fast connections
    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, 300);

    // Show warning toast if loading takes too long
    const timeoutTimer = setTimeout(() => {
      setLoadingTimeout(true);
      toast({
        title: "Loading Taking Longer",
        description: "Authentication verification is taking longer than expected",
        variant: "default"
      });
    }, 5000);
    
    // Show critical error if extremely long loading time
    const criticalTimer = setTimeout(() => {
      setCriticalTimeout(true);
      toast({
        title: "Authentication Issue",
        description: "There might be a problem with the authentication service",
        variant: "destructive"
      });
    }, 15000);
    
    return () => {
      clearTimeout(readyTimer);
      clearTimeout(timeoutTimer);
      clearTimeout(criticalTimer);
    };
  }, [toast]);
  
  // Show loading state
  if (authLoading && !isReady) {
    return (
      <div className="flex items-center justify-center h-screen p-6">
        <div className="w-full max-w-md space-y-6">
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-32 w-full rounded-md" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
          {loadingTimeout && (
            <div className="text-center text-sm text-muted-foreground bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
              <p>Taking longer than usual. Please check your connection.</p>
              {criticalTimeout && (
                <div className="mt-2 flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-500">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Authentication service may be unavailable.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Simple public routes check - allow access without auth
  const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/forgot-password'];
  if (publicRoutes.includes(location.pathname)) {
    return user ? <Navigate to="/dashboard" /> : <Outlet />;
  }
  
  // Handle dashboard and other protected routes
  if (!user) {
    // Save the current path to redirect back after login
    const returnPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/login?returnTo=${returnPath}`} replace />;
  }
  
  // User is authenticated and trying to access a protected route
  return <Outlet />;
};

export default PrivateRoute;
