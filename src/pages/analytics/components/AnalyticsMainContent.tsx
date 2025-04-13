
import React, { Suspense, lazy, useState } from 'react';
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
import { ContentQualityMetrics } from '@/components/analytics/ContentQualityMetrics';
import { PredictiveAnalytics } from '@/components/analytics/PredictiveAnalytics';
import { ProjectComparisonTool } from '@/components/analytics/ProjectComparisonTool';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, LineChart, PieChart, ListFilter, FileSpreadsheet } from 'lucide-react';

// Lazy-loaded component for performance optimization
const AnalyticsCharts = lazy(() => import('@/components/analytics/AnalyticsCharts').then(
  module => ({ default: module.AnalyticsCharts })
));

// Lazy-loaded component for custom report builder
const CustomReportBuilder = lazy(() => import('@/components/analytics/CustomReportBuilder').then(
  module => ({ default: module.CustomReportBuilder })
));

export const AnalyticsMainContent = () => {
  const { projects } = useDashboard();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Determine if we should show empty states
  const showEmptyState = projects.length === 0;
  
  return (
    <div className="space-y-6 analytics-container">
      <ThemeCard className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">Analytics</CardTitle>
          <CardDescription>
            Your project stats, performance metrics, and predictive insights.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 size={16} />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="predictive" className="flex items-center gap-2">
                <LineChart size={16} />
                <span>Predictive</span>
              </TabsTrigger>
              <TabsTrigger value="quality" className="flex items-center gap-2">
                <PieChart size={16} />
                <span>Quality Metrics</span>
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex items-center gap-2">
                <FileSpreadsheet size={16} />
                <span>Custom Reports</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
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
            </TabsContent>
            
            <TabsContent value="predictive">
              <PredictiveAnalytics />
            </TabsContent>
            
            <TabsContent value="quality">
              <ContentQualityMetrics />
            </TabsContent>
            
            <TabsContent value="custom">
              <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
                <CustomReportBuilder />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </ThemeCard>
      
      {!showEmptyState && activeTab !== 'custom' && (
        <ProjectComparisonTool />
      )}
    </div>
  );
};
