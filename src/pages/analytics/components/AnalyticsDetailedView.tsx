
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useDashboard } from '@/contexts/DashboardContext';
import { AnalyticsEmptyState } from './AnalyticsEmptyState';

export const AnalyticsDetailedView = () => {
  const { projects, isDemo } = useDashboard();

  if (projects.length === 0 && !isDemo) {
    return <AnalyticsEmptyState />;
  }

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Detailed analytics features will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
