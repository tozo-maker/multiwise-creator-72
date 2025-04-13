
import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DashboardLoadingProps {
  timeout?: number;
}

export const DashboardLoading: React.FC<DashboardLoadingProps> = React.memo(({ 
  timeout = 15000 
}) => {
  const { isDark } = useTheme();
  const [isLongLoad, setIsLongLoad] = useState(false);
  const [isVeryLongLoad, setIsVeryLongLoad] = useState(false);
  
  useEffect(() => {
    const longLoadTimer = setTimeout(() => {
      setIsLongLoad(true);
    }, 5000);
    
    const veryLongLoadTimer = setTimeout(() => {
      setIsVeryLongLoad(true);
    }, timeout);
    
    return () => {
      clearTimeout(longLoadTimer);
      clearTimeout(veryLongLoadTimer);
    };
  }, [timeout]);

  return (
    <div 
      className="flex items-center justify-center h-64 flex-col" 
      role="status" 
      aria-live="polite"
    >
      <div className="flex flex-col items-center space-y-4">
        <Loader2 
          className="h-8 w-8 text-brand-500 animate-spin" 
          aria-hidden="true" 
        />
        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
          Loading your dashboard...
        </p>
        
        {isLongLoad && (
          <div className="text-center max-w-md mt-4">
            <p className="text-sm text-muted-foreground">
              This is taking longer than expected. Please wait a moment...
            </p>
          </div>
        )}
        
        {isVeryLongLoad && (
          <Alert variant="destructive" className="mt-4 max-w-md">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              We're having trouble loading your dashboard. Try refreshing the page or checking your connection.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
});

DashboardLoading.displayName = 'DashboardLoading';
