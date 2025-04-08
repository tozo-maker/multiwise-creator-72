
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart2, Users, BookOpen, Clock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const AnalyticsOverview = () => {
  const { theme } = useTheme();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md dark:hover:shadow-slate-800/30 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-slate-100">Total Projects</CardTitle>
          <div className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-950/30">
            <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">12</div>
          <p className="text-xs text-muted-foreground dark:text-slate-400">
            +2 from last month
          </p>
        </CardContent>
      </Card>
      
      <Card className="border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md dark:hover:shadow-slate-800/30 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-slate-100">Active Users</CardTitle>
          <div className="p-2 rounded-full bg-green-50 dark:bg-green-950/30">
            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">5</div>
          <p className="text-xs text-muted-foreground dark:text-slate-400">
            +1 from last month
          </p>
        </CardContent>
      </Card>
      
      <Card className="border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md dark:hover:shadow-slate-800/30 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-slate-100">Content Generated</CardTitle>
          <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-950/30">
            <BarChart2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">48,492</div>
          <p className="text-xs text-muted-foreground dark:text-slate-400">
            +15% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card className="border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md dark:hover:shadow-slate-800/30 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-slate-100">Avg. Time Saved</CardTitle>
          <div className="p-2 rounded-full bg-amber-50 dark:bg-amber-950/30">
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">4.2h</div>
          <p className="text-xs text-muted-foreground dark:text-slate-400">
            Per project
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
