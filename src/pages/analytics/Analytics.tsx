
import React from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';

export const Analytics = () => {
  return (
    <ModernLayout contentWidth="wide">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Your project stats and performance metrics.
          </p>
        </div>
        
        <AnalyticsOverview />
        
        <AnalyticsCharts />
      </div>
    </ModernLayout>
  );
};

export default Analytics;
