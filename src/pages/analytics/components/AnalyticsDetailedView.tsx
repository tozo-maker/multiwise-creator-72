
import React, { Suspense, lazy } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useDashboard } from '@/contexts/DashboardContext';
import { AnalyticsEmptyState } from './AnalyticsEmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/ui/page-header';
import { useMediaQuery } from '@/hooks/use-media-query';

// Fix lazy-loaded imports for named exports
const ContentQualityMetricsChart = lazy(() => import('@/components/analytics/ContentQualityMetrics').then(module => ({ default: module.ContentQualityMetrics })));
const ProjectComparisonView = lazy(() => import('@/components/analytics/ProjectComparisonTool').then(module => ({ default: module.ProjectComparisonTool })));

export const AnalyticsDetailedView = () => {
  const { projects, isDemo } = useDashboard();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Render the empty state if no projects are available and not in demo mode
  if (projects.length === 0 && !isDemo) {
    return <AnalyticsEmptyState />;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        heading="Detailed Analytics" 
        subheading="In-depth analysis and performance metrics"
      />
      
      {/* Content Quality Section */}
      <Card className="border border-slate-200 dark:border-slate-700 overflow-hidden">
        <CardHeader>
          <CardTitle>Content Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <ContentQualityMetricsChart />
          </Suspense>
        </CardContent>
      </Card>
      
      {/* Project Comparison Section */}
      {!isMobile && (
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Project Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <ProjectComparisonView />
            </Suspense>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDetailedView;
