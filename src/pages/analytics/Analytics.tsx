
import React from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart, PieChart, Calendar } from 'lucide-react';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
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

export const Analytics = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Sample data for charts
  const performanceData = [
    { month: 'Jan', engagement: 65, completion: 40, progress: 24 },
    { month: 'Feb', engagement: 59, completion: 45, progress: 29 },
    { month: 'Mar', engagement: 80, completion: 52, progress: 45 },
    { month: 'Apr', engagement: 81, completion: 56, progress: 50 },
    { month: 'May', engagement: 76, completion: 60, progress: 65 },
    { month: 'Jun', engagement: 85, completion: 70, progress: 75 },
    { month: 'Jul', engagement: 90, completion: 85, progress: 80 },
  ];

  const contentTypeData = [
    { name: 'Video', value: 35 },
    { name: 'Text', value: 25 },
    { name: 'Interactive', value: 20 },
    { name: 'Assessment', value: 15 },
    { name: 'Other', value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Analytics' }
  ];

  return (
    <ModernLayout contentWidth="wide">
      <div className="space-y-6">
        <div className="pt-4">
          <PageBreadcrumbs items={breadcrumbItems} />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold tracking-tight dark:text-white">Analytics</h2>
          <p className="text-muted-foreground dark:text-slate-400">
            Your project stats and performance metrics.
          </p>
        </div>
        
        <AnalyticsOverview />
        
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
        
        <AnalyticsCharts />
      </div>
    </ModernLayout>
  );
};

export default Analytics;
