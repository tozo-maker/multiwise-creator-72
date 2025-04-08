
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const DashboardLoading: React.FC = React.memo(() => {
  const { isDark } = useTheme();

  return (
    <div 
      className="flex items-center justify-center h-64" 
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
      </div>
    </div>
  );
});

DashboardLoading.displayName = 'DashboardLoading';
