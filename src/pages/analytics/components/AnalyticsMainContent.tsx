
import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { useDashboard } from '@/contexts/DashboardContext';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsEmptyState } from './AnalyticsEmptyState';
import { ProjectCalendar } from './ProjectCalendar';
import { ProjectPerformanceChart } from './ProjectPerformanceChart';
import { ContentTypeDistributionChart } from './ContentTypeDistributionChart';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ProjectAnalyticsExport } from '@/components/analytics/ProjectAnalyticsExport';

// Lazy-loaded component for performance optimization
const AnalyticsCharts = lazy(() => import('@/components/analytics/AnalyticsCharts').then(
  module => ({ default: module.AnalyticsCharts })
));

export const AnalyticsMainContent = () => {
  const { projects } = useDashboard();
  
  // Determine if we should show empty states
  const showEmptyState = projects.length === 0;
  
  return (
    <div className="space-y-6 analytics-container">
      <ThemeCard className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">Analytics</CardTitle>
          <CardDescription>
            Your project stats and performance metrics.
          </CardDescription>
        </CardHeader>
      </ThemeCard>
      
      <AnalyticsHeader />
      
      {showEmptyState ? (
        <AnalyticsEmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-6">
            <div className="lg:col-span-4">
              <ProjectAnalyticsExport />
            </div>
            
            <div className="lg:col-span-3">
              <ProjectPerformanceChart />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-6">
            <div className="lg:col-span-4">
              <ContentTypeDistributionChart />
            </div>
            
            <div className="lg:col-span-3">
              <ProjectCalendar />
            </div>
          </div>
          
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <AnalyticsCharts />
          </Suspense>
        </>
      )}
    </div>
  );
};
