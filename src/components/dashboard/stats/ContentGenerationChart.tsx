
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { EmptyState } from '@/components/dashboard/EmptyStates';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface ContentGenerationChartProps {
  data: Array<{ date: string; count: number }>;
}

export const ContentGenerationChart: React.FC<ContentGenerationChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartConfig = {
    contentGeneration: {
      label: "Content Generation",
      theme: {
        light: "#8b5cf6",
        dark: "#a78bfa",
      },
    }
  };

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
      <Card className="col-span-1 border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md dark:hover:shadow-slate-800/30 backdrop-blur-sm bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center dark:text-white">
            <BarChart2 className="h-5 w-5 mr-2 text-brand-500" />
            Content Generation Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            {data.length > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="aspect-[4/3] w-full h-full"
              >
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDark ? "#a78bfa" : "#8b5cf6"} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={isDark ? "#a78bfa" : "#8b5cf6"} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    stroke={isDark ? "#64748b" : "#94a3b8"}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}`}
                    stroke={isDark ? "#64748b" : "#94a3b8"}
                  />
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke={isDark ? "#334155" : "#f1f5f9"}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent />
                    }
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke={isDark ? "#a78bfa" : "#8b5cf6"} 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="contentGeneration"
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <EmptyState 
                type="content"
                title="No content generation data"
                description="Start creating content to see your generation trends"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
