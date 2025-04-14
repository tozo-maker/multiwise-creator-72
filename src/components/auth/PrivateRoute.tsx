
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PrivateRoute = () => {
  const { user, isLoading, isAuthenticated, authError, retryAuthentication } = useAuth();
  
  const location = useLocation();
  const { toast } = useToast();
  const [isReady, setIsReady] = React.useState(false);
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);
  const [criticalTimeout, setCriticalTimeout] = React.useState(false);
  
  // Debugging info
  useEffect(() => {
    console.log('PrivateRoute render:', { 
      isAuthenticated, 
      isLoading, 
      user: user?.email || 'none',
      path: location.pathname,
      authError: authError || 'none'
    });
  }, [isAuthenticated, isLoading, user, location.pathname, authError]);
  
  // Handle auth recovery
  const handleRetryAuth = async () => {
    if (retryAuthentication) {
      const success = await retryAuthentication();
      
      if (success) {
        toast({
          title: "Authentication Restored",
          description: "Your session has been successfully refreshed",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "Unable to restore your session. Please try logging in again.",
        });
      }
    }
  };
  
  useEffect(() => {
    // Small delay to prevent flash of loading state for fast connections
    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, 300);

    // Show warning toast if loading takes too long
    const timeoutTimer = setTimeout(() => {
      setLoadingTimeout(true);
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
  if (isLoading && !isReady) {
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
              <p>Taking longer than usual to authenticate. Please wait...</p>
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
  
  // Show auth error recovery option
  if (authError && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-medium">Authentication Error</h3>
            </div>
            <p className="mt-2 text-sm text-red-600 dark:text-red-300">{authError}</p>
            
            <div className="mt-4 flex flex-col gap-2">
              <Button 
                onClick={handleRetryAuth}
                className="w-full"
              >
                Retry Authentication
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/auth/login'}
                className="w-full"
              >
                Go to Login Page
              </Button>
            </div>
          </div>
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
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    // Save the current path to redirect back after login
    const returnPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/login?returnTo=${returnPath}`} replace />;
  }
  
  // User is authenticated and trying to access a protected route
  console.log('User authenticated, allowing access to protected route');
  return <Outlet />;
};

export default PrivateRoute;
