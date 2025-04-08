
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { EmptyState } from '@/components/dashboard/EmptyStates';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectActivityChartProps {
  data: Array<{ name: string; value: number }>;
}

export const ProjectActivityChart: React.FC<ProjectActivityChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartConfig = {
    activity: {
      label: "Activity",
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
            <Activity className="h-5 w-5 mr-2 text-brand-500" />
            Project Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            {data.length > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="aspect-[4/3] w-full h-full"
              >
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis 
                    dataKey="name" 
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
                  <Bar 
                    dataKey="value" 
                    name="activity"
                    fill={isDark ? "#a78bfa" : "#8b5cf6"} 
                    radius={[4, 4, 0, 0]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <EmptyState 
                type="activity"
                title="No activity data"
                description="Your project activity will appear here"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
