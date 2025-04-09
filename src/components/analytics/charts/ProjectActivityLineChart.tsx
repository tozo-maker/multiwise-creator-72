
import React from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectActivityLineChartProps {
  data: { name: string; value: number }[];
  hasData: boolean;
}

export const ProjectActivityLineChart = ({ data, hasData }: ProjectActivityLineChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const chartStrokeColor = isDark ? "#64748b" : "#888888";
  const lineStrokeColor = isDark ? "#a78bfa" : "#8884d8";

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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
  );
};
