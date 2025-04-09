
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart, PieChart, Calendar } from 'lucide-react';
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

// Lazy-loaded component for performance optimization
const AnalyticsCharts = lazy(() => import('@/components/analytics/AnalyticsCharts').then(
  module => ({ default: module.AnalyticsCharts })
));

export const Analytics = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { contentGenerationData, activityData, isDemo } = useDashboard();
  const { user } = useAuth();
  
  // Derive content type data - in a real app, this would come from the database
  const [contentTypeData, setContentTypeData] = useState([
    { name: 'Video', value: 35 },
    { name: 'Text', value: 25 },
    { name: 'Interactive', value: 20 },
    { name: 'Assessment', value: 15 },
    { name: 'Other', value: 5 },
  ]);
  
  // Format performance data from activity and content data
  const [performanceData, setPerformanceData] = useState([]);
  
  useEffect(() => {
    if (contentGenerationData && activityData) {
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
      // This is a simplified approach - in a real app we'd use real metrics
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
      const newPerformanceData = months.map(month => {
        // Calculate values with some randomization for demo purposes
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
    }
  }, [contentGenerationData, activityData]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Analytics' }
  ];

  return (
    <ModernLayout contentWidth="wide">
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
          
          {isDemo && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              Demo Data
            </Badge>
          )}
        </div>
        
        <AnalyticsOverview />
        
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
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {contentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
      </div>
    </ModernLayout>
  );
};

export default Analytics;
