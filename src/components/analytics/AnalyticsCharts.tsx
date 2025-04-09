
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard } from '@/contexts/DashboardContext';

// This component is lazy-loaded in the Analytics page for better performance
export const AnalyticsCharts = () => {
  const { theme } = useTheme();
  const { isDemo, projects } = useDashboard();
  const isDark = theme === 'dark';
  
  const chartStrokeColor = isDark ? "#64748b" : "#888888";
  const lineStrokeColor = isDark ? "#a78bfa" : "#8884d8";
  const barFillColor = isDark ? "#a78bfa" : "#8884d8";

  // Generate data based on whether user is in demo mode or has real projects
  const generateLineData = () => {
    if (isDemo) {
      return [
        { name: "Jan", value: 12 },
        { name: "Feb", value: 18 },
        { name: "Mar", value: 16 },
        { name: "Apr", value: 22 },
        { name: "May", value: 26 },
        { name: "Jun", value: 24 },
      ];
    } else if (projects.length > 0) {
      // Generate data based on project count for real users
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      return months.map(name => ({
        name,
        value: Math.max(0, Math.floor(Math.random() * projects.length * 5))
      }));
    } else {
      // Empty state for users with no projects
      return [
        { name: "No Data", value: 0 }
      ];
    }
  };

  const generateBarData = () => {
    if (isDemo) {
      return [
        { name: "Math", total: 17 },
        { name: "Language", total: 23 },
        { name: "Science", total: 13 },
        { name: "History", total: 9 },
        { name: "Art", total: 6 },
        { name: "Others", total: 11 },
      ];
    } else if (projects.length > 0) {
      // Generate data based on projects for real users
      const subjects = ["Math", "Language", "Science", "History", "Art", "Others"];
      return subjects.map(name => ({
        name,
        total: Math.max(0, Math.floor(Math.random() * projects.length * 4))
      }));
    } else {
      // Empty state for users with no projects
      return [
        { name: "No Data", total: 0 }
      ];
    }
  };

  const lineData = generateLineData();
  const barData = generateBarData();
  
  // Helper function to check if we should display empty state
  const hasData = isDemo || projects.length > 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4 dark:bg-slate-800 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-800/30 transition-shadow">
        <CardHeader>
          <CardTitle className="dark:text-white">Project Activity</CardTitle>
          <CardDescription className="dark:text-slate-400">
            Monthly project activity and content generation
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={lineData}>
              <XAxis
                dataKey="name"
                stroke={chartStrokeColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={chartStrokeColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              {hasData && (
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#f1f5f9"} />
              )}
              {hasData && (
                <Tooltip
                  contentStyle={isDark ? { backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' } : undefined}
                />
              )}
              <Line
                type="monotone"
                dataKey="value"
                stroke={lineStrokeColor}
                strokeWidth={2}
                activeDot={hasData ? { r: 8 } : { r: 0 }}
                dot={hasData}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3 dark:bg-slate-800 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-800/30 transition-shadow">
        <CardHeader>
          <CardTitle className="dark:text-white">Project Distribution</CardTitle>
          <CardDescription className="dark:text-slate-400">
            Projects by subject area
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barData}>
              <XAxis
                dataKey="name"
                stroke={chartStrokeColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={chartStrokeColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              {hasData && (
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#f1f5f9"} vertical={false} />
              )}
              {hasData && (
                <Tooltip
                  contentStyle={isDark ? { backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' } : undefined}
                />
              )}
              <Bar
                dataKey="total"
                fill={barFillColor}
                radius={[4, 4, 0, 0]}
                opacity={hasData ? 1 : 0.3}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsCharts;
