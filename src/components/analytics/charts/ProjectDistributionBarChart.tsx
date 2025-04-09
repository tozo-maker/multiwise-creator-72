
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectDistributionBarChartProps {
  data: { name: string; total: number }[];
  hasData: boolean;
}

export const ProjectDistributionBarChart = ({ data, hasData }: ProjectDistributionBarChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const chartStrokeColor = isDark ? "#64748b" : "#888888";
  const barFillColor = isDark ? "#a78bfa" : "#8884d8";

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
  );
};
