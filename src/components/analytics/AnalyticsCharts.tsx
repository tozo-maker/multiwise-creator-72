
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Project Activity</CardTitle>
          <CardDescription>
            Monthly project activity and content generation
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={lineData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Project Distribution</CardTitle>
          <CardDescription>
            Projects by subject area
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar
                dataKey="total"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
