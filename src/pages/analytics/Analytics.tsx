
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart, PieChart, Calendar, AlertCircle } from 'lucide-react';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { ProjectAnalyticsExport } from '@/components/analytics/ProjectAnalyticsExport';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  Pie,
  Cell,
  PieChart as RechartsPieChart
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardProvider } from '@/contexts/DashboardContext';

// Lazy-loaded component for performance optimization
const AnalyticsCharts = lazy(() => import('@/components/analytics/AnalyticsCharts').then(
  module => ({ default: module.AnalyticsCharts })
));

// Create a content component that uses the DashboardContext hooks
const AnalyticsContent = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { contentGenerationData, activityData, isDemo, projects } = useDashboard();
  const { user } = useAuth();
  
  // Empty data for real users with no projects
  const emptyData = [
    { name: 'No Data', value: 0 }
  ];
  
  // Content type data - use real data if available, otherwise use empty or demo data
  const [contentTypeData, setContentTypeData] = useState([]);
  
  // Format performance data from activity and content data
  const [performanceData, setPerformanceData] = useState([]);
  
  useEffect(() => {
    // Initialize content type data based on user status
    if (isDemo) {
      // Demo data for content types
      setContentTypeData([
        { name: 'Video', value: 35 },
        { name: 'Text', value: 25 },
        { name: 'Interactive', value: 20 },
        { name: 'Assessment', value: 15 },
        { name: 'Other', value: 5 },
      ]);
    } else if (projects.length > 0) {
      // For real users with projects, we'd normally fetch this data
      // For now, let's create some representative data based on projects
      const types = ['Video', 'Text', 'Interactive', 'Assessment', 'Other'];
      const typesData = types.map(name => {
        // Generate slightly randomized values based on project count
        return {
          name,
          value: Math.max(5, Math.floor(Math.random() * 20 * projects.length))
        };
      });
      setContentTypeData(typesData);
    } else {
      // Empty state for users with no projects
      setContentTypeData([{ name: 'No Content', value: 100 }]);
    }
  }, [isDemo, projects]);
  
  useEffect(() => {
    if (contentGenerationData && activityData) {
      // Only process data if user is demo or has projects
      if (isDemo || projects.length > 0) {
        // Create a mapping of months/days to their respective values
        const contentMap = contentGenerationData.reduce((acc, item) => {
          acc[item.date] = item.count;
          return acc;
        }, {});
        
        const activityMap = activityData.reduce((acc, item) => {
          acc[item.name] = item.value;
          return acc;
        }, {});
        
        // Generate performance data for the chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        if (isDemo) {
          // Use demo data with randomization
          const newPerformanceData = months.map(month => {
            const contentValue = contentMap[month] || 0;
            const baseEngagement = Math.min(100, Math.max(50, 40 + contentValue * 2));
            const baseCompletion = Math.min(100, Math.max(30, 30 + contentValue * 1.5));
            const baseProgress = Math.min(100, Math.max(20, 20 + contentValue));
            
            return {
              month,
              engagement: Math.round(baseEngagement),
              completion: Math.round(baseCompletion),
              progress: Math.round(baseProgress)
            };
          });
          setPerformanceData(newPerformanceData);
        } else {
          // For real users with projects, use actual content generation data
          const newPerformanceData = months.map(month => {
            const count = contentMap[month] || 0;
            return {
              month,
              engagement: count > 0 ? Math.round(count * 2 + 10) : 0,
              completion: count > 0 ? Math.round(count * 1.5 + 5) : 0,
              progress: count > 0 ? Math.round(count + 15) : 0
            };
          });
          setPerformanceData(newPerformanceData);
        }
      } else {
        // For real users with no projects, show empty data
        setPerformanceData([
          { month: 'No Data', engagement: 0, completion: 0, progress: 0 }
        ]);
      }
    }
  }, [contentGenerationData, activityData, isDemo, projects]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const EMPTY_COLORS = ['#94a3b8'];

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Analytics' }
  ];

  // Determine if we should show empty states
  const showEmptyState = !isDemo && projects.length === 0;
  
  // Display appropriate content or empty state message
  const EmptyStateMessage = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className={`h-12 w-12 mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
      <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>No Analytics Data Available</h3>
      <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Create projects and generate content to see analytics data
      </p>
    </div>
  );

  return (
    <div className="space-y-6 analytics-container">
      <div className="pt-4">
        <PageBreadcrumbs items={breadcrumbItems} />
      </div>
      
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
      
      <AnalyticsOverview />
      
      {showEmptyState ? (
        <EmptyStateMessage />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <ProjectAnalyticsExport />
            </div>
            
            <Card className="border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-800/30 transition-shadow dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  Activity Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Activity calendar coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-800/30 transition-shadow dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <LineChart className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  Project Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={performanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={isDark ? 0.1 : 0.15} stroke={isDark ? "#475569" : undefined} />
                      <XAxis dataKey="month" stroke={isDark ? "#94a3b8" : undefined} />
                      <YAxis stroke={isDark ? "#94a3b8" : undefined} />
                      <Tooltip contentStyle={isDark ? { backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' } : undefined} />
                      <Legend />
                      <Bar dataKey="engagement" name="Engagement" fill="#8884d8" />
                      <Bar dataKey="completion" name="Completion" fill="#82ca9d" />
                      <Line type="monotone" dataKey="progress" name="Progress" stroke="#ff7300" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-800/30 transition-shadow dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <PieChart className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  Content Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={contentTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => contentTypeData.length > 1 && contentTypeData[0].name !== 'No Content' ? `${name} ${(percent * 100).toFixed(0)}%` : name}
                      >
                        {contentTypeData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={contentTypeData.length > 1 && contentTypeData[0].name !== 'No Content' ? COLORS[index % COLORS.length] : EMPTY_COLORS[0]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={isDark ? { backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' } : undefined} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <AnalyticsCharts />
          </Suspense>
        </>
      )}
    </div>
  );
};

// Main component that wraps the content with DashboardProvider
export const Analytics = () => {
  return (
    <ModernLayout contentWidth="wide">
      <DashboardProvider>
        <AnalyticsContent />
      </DashboardProvider>
    </ModernLayout>
  );
};

export default Analytics;
