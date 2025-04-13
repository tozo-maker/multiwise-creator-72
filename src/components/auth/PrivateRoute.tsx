
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export const PrivateRoute = () => {
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isReady, setIsReady] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  useEffect(() => {
    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, 300);

    const timeoutTimer = setTimeout(() => {
      setLoadingTimeout(true);
      toast({
        title: "Loading Timeout",
        description: "Authentication is taking longer than expected",
        variant: "default"
      });
    }, 5000);
    
    return () => {
      clearTimeout(readyTimer);
      clearTimeout(timeoutTimer);
    };
  }, []);
  
  if (authLoading || !isReady) {
    return (
      <div className="flex items-center justify-center h-screen p-6">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          {loadingTimeout && (
            <div className="text-center text-sm text-muted-foreground">
              Taking longer than usual. Please check your connection.
            </div>
          )}
        </div>
      </div>
    );
  }
  
  if (location.pathname === '/dashboard') {
    return user ? <Outlet /> : <Navigate to="/auth/login" />;
  }
  
  if (!user) {
    const returnPath = location.pathname + location.search;
    return <Navigate to={`/auth/login?returnTo=${encodeURIComponent(returnPath)}`} replace />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;
