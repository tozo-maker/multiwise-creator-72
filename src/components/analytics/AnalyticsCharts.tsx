
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

const lineData = [
  {
    name: "Jan",
    value: 12,
  },
  {
    name: "Feb",
    value: 18,
  },
  {
    name: "Mar",
    value: 16,
  },
  {
    name: "Apr",
    value: 22,
  },
  {
    name: "May",
    value: 26,
  },
  {
    name: "Jun",
    value: 24,
  },
];

const barData = [
  {
    name: "Math",
    total: 17,
  },
  {
    name: "Language",
    total: 23,
  },
  {
    name: "Science",
    total: 13,
  },
  {
    name: "History",
    total: 9,
  },
  {
    name: "Art",
    total: 6,
  },
  {
    name: "Others",
    total: 11,
  },
];

export const AnalyticsCharts = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const chartStrokeColor = isDark ? "#64748b" : "#888888";
  const lineStrokeColor = isDark ? "#a78bfa" : "#8884d8";
  const barFillColor = isDark ? "#a78bfa" : "#8884d8";

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
              <Line
                type="monotone"
                dataKey="value"
                stroke={lineStrokeColor}
                strokeWidth={2}
                activeDot={{ r: 8 }}
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
              <Bar
                dataKey="total"
                fill={barFillColor}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
