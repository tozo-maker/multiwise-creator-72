
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookText, 
  Users, 
  Activity, 
  Clock, 
  BarChart2, 
  Calendar, 
  FileText,
  Bookmark,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '@/contexts/DashboardContext';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/dashboard/EmptyStates';
import { motion } from 'framer-motion';

const chartConfig = {
  contentGeneration: {
    label: "Content Generation",
    theme: {
      light: "#8b5cf6",
      dark: "#a78bfa",
    },
  },
  activity: {
    label: "Activity",
    theme: {
      light: "#8b5cf6",
      dark: "#a78bfa",
    },
  },
};

export const DashboardStats: React.FC = () => {
  const { projectStats, activityData, contentGenerationData, isLoading } = useDashboard();

  const statCards = [
    {
      title: 'Total Projects',
      value: projectStats.totalProjects,
      icon: <BookText className="h-5 w-5 text-indigo-600" />,
      trend: '+12% from last month',
      trendUp: true,
      backgroundColor: 'bg-indigo-50',
      ariaLabel: 'Total projects count'
    },
    {
      title: 'Active Projects',
      value: projectStats.activeProjects,
      icon: <Activity className="h-5 w-5 text-green-600" />,
      trend: '+5% from last month',
      trendUp: true,
      backgroundColor: 'bg-green-50',
      ariaLabel: 'Active projects count'
    },
    {
      title: 'Content Created',
      value: projectStats.contentCount,
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      trend: '+25% from last month',
      trendUp: true,
      backgroundColor: 'bg-blue-50',
      ariaLabel: 'Content items count'
    },
    {
      title: 'Knowledge Base Files',
      value: projectStats.knowledgeBaseFiles,
      icon: <Bookmark className="h-5 w-5 text-amber-600" />,
      trend: '+8% from last month',
      trendUp: true,
      backgroundColor: 'bg-amber-50',
      ariaLabel: 'Knowledge base files count'
    }
  ];

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[240px] w-full" />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[240px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerAnimation}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemAnimation} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="border border-slate-200 transition-all hover:shadow-md bg-gradient-to-br from-white to-slate-50">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1 text-slate-800" aria-label={stat.ariaLabel}>{stat.value}</h3>
                  <p className={`text-xs mt-1 flex items-center ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : null}
                    {stat.trend}
                  </p>
                </div>
                <div className={`p-2 rounded-full ${stat.backgroundColor}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={itemAnimation} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 border border-slate-200 transition-all hover:shadow-md backdrop-blur-sm bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-brand-500" />
              Content Generation Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              {contentGenerationData.length > 0 ? (
                <ChartContainer
                  config={chartConfig}
                  className="aspect-[4/3] w-full h-full"
                >
                  <AreaChart
                    data={contentGenerationData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      vertical={false} 
                      stroke="#f1f5f9"
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent />
                      }
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8b5cf6" 
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

        <Card className="col-span-1 border border-slate-200 transition-all hover:shadow-md backdrop-blur-sm bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Activity className="h-5 w-5 mr-2 text-brand-500" />
              Project Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              {activityData.length > 0 ? (
                <ChartContainer
                  config={chartConfig}
                  className="aspect-[4/3] w-full h-full"
                >
                  <BarChart
                    data={activityData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent />
                      }
                    />
                    <Bar 
                      dataKey="value" 
                      name="activity"
                      fill="#8b5cf6" 
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
    </motion.div>
  );
};
