
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart2, Users, BookOpen, Clock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const AnalyticsOverview = () => {
  const { theme } = useTheme();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-slate-100">Total Projects</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">12</div>
          <p className="text-xs text-muted-foreground">
            +2 from last month
          </p>
        </CardContent>
      </Card>
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-slate-100">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">5</div>
          <p className="text-xs text-muted-foreground">
            +1 from last month
          </p>
        </CardContent>
      </Card>
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-slate-100">Content Generated</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">48,492</div>
          <p className="text-xs text-muted-foreground">
            +15% from last month
          </p>
        </CardContent>
      </Card>
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-slate-100">Avg. Time Saved</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">4.2h</div>
          <p className="text-xs text-muted-foreground">
            Per project
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
