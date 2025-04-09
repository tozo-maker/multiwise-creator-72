
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useDashboard } from '@/contexts/DashboardContext';

export const AnalyticsHeader = () => {
  const { isDemo } = useDashboard();
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Analytics</h2>
        <p className="text-muted-foreground dark:text-slate-400">
          Your project stats and performance metrics.
        </p>
      </div>
      
      {isDemo ? (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
          Demo Data
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
          Live Data
        </Badge>
      )}
    </div>
  );
};
