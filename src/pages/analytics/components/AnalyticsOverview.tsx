
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, BarChart2, Users, BookOpen, Clock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { ContentTypeDistributionChart } from './ContentTypeDistributionChart';
import { ProjectPerformanceChart } from './ProjectPerformanceChart';
import { ProjectCalendar } from './ProjectCalendar';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsEmptyState } from './AnalyticsEmptyState';

export const AnalyticsOverview = () => {
  const { isDark } = useTheme();
  const { projects, isDemo } = useDashboard();
  
  // Calculate values based on real data or demo mode
  const getTotalProjects = () => isDemo ? 12 : projects.length;
  const getActiveUsers = () => isDemo ? 5 : Math.max(1, Math.ceil(projects.length / 2)); 
  const getContentGenerated = () => isDemo ? 48492 : projects.length * 100;
  const getTimeSaved = () => isDemo ? 4.2 : projects.length > 0 ? (2.5 + (projects.length * 0.5)).toFixed(1) : 0;
  
  // Calculate trend text
  const getProjectTrend = () => {
    if (!isDemo && projects.length === 0) return "No projects yet";
    return "+2 from last month";
  };
  
  const getUsersTrend = () => {
    if (!isDemo && projects.length === 0) return "No users yet";
    return "+1 from last month";
  };
  
  const getContentTrend = () => {
    if (!isDemo && projects.length === 0) return "No content yet";
    return "+15% from last month";
  };

  if (projects.length === 0 && !isDemo) {
    return <AnalyticsEmptyState />;
  }
  
  return (
    <div className="space-y-6">
      <AnalyticsHeader />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md dark:hover:shadow-slate-800/30 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80">
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium dark:text-slate-100">Total Projects</h3>
              <div className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-950/30">
                <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="text-2xl font-bold dark:text-white">{getTotalProjects()}</div>
            <p className="text-xs text-muted-foreground dark:text-slate-400">
              {getProjectTrend()}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md dark:hover:shadow-slate-800/30 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80">
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium dark:text-slate-100">Active Users</h3>
              <div className="p-2 rounded-full bg-green-50 dark:bg-green-950/30">
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold dark:text-white">{getActiveUsers()}</div>
            <p className="text-xs text-muted-foreground dark:text-slate-400">
              {getUsersTrend()}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md dark:hover:shadow-slate-800/30 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80">
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium dark:text-slate-100">Content Generated</h3>
              <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-950/30">
                <BarChart2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold dark:text-white">{getContentGenerated().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground dark:text-slate-400">
              {getContentTrend()}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md dark:hover:shadow-slate-800/30 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80">
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium dark:text-slate-100">Avg. Time Saved</h3>
              <div className="p-2 rounded-full bg-amber-50 dark:bg-amber-950/30">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="text-2xl font-bold dark:text-white">{getTimeSaved()}h</div>
            <p className="text-xs text-muted-foreground dark:text-slate-400">
              {projects.length > 0 || isDemo ? "Per project" : "No projects yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectPerformanceChart />
        <ContentTypeDistributionChart />
      </div>
      
      <ProjectCalendar />
    </div>
  );
};
