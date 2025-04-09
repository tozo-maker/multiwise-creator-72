
import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { ProjectAnalyticsExport } from '@/components/analytics/ProjectAnalyticsExport';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { useDashboard } from '@/contexts/DashboardContext';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsEmptyState } from './AnalyticsEmptyState';
import { ProjectCalendar } from './ProjectCalendar';
import { ProjectPerformanceChart } from './ProjectPerformanceChart';
import { ContentTypeDistributionChart } from './ContentTypeDistributionChart';

// Lazy-loaded component for performance optimization
const AnalyticsCharts = lazy(() => import('@/components/analytics/AnalyticsCharts').then(
  module => ({ default: module.AnalyticsCharts })
));

export const AnalyticsMainContent = () => {
  const { isDemo, projects } = useDashboard();
  
  // Determine if we should show empty states
  const showEmptyState = !isDemo && projects.length === 0;
  
  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Analytics' }
  ];

  return (
    <div className="space-y-6 analytics-container">
      <div className="pt-4">
        <PageBreadcrumbs items={breadcrumbItems} />
      </div>
      
      <AnalyticsHeader />
      
      <AnalyticsOverview />
      
      {showEmptyState ? (
        <AnalyticsEmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <ProjectAnalyticsExport />
            </div>
            
            <ProjectCalendar />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ProjectPerformanceChart />
            <ContentTypeDistributionChart />
          </div>
          
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <AnalyticsCharts />
          </Suspense>
        </>
      )}
    </div>
  );
};
