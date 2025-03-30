
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
  ArrowUpRight
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  contentCount: number;
  knowledgeBaseFiles: number;
  averageProgressRate: number;
}

interface ActivityData {
  name: string;
  value: number;
}

interface DashboardStatsProps {
  projectStats: ProjectStats;
  activityData: ActivityData[];
  contentGenerationData: {
    date: string;
    count: number;
  }[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  projectStats,
  activityData,
  contentGenerationData
}) => {
  const statCards = [
    {
      title: 'Total Projects',
      value: projectStats.totalProjects,
      icon: <BookText className="h-5 w-5 text-indigo-600" />,
      trend: '+12% from last month',
      trendUp: true
    },
    {
      title: 'Active Projects',
      value: projectStats.activeProjects,
      icon: <Activity className="h-5 w-5 text-green-600" />,
      trend: '+5% from last month',
      trendUp: true
    },
    {
      title: 'Content Created',
      value: projectStats.contentCount,
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      trend: '+25% from last month',
      trendUp: true
    },
    {
      title: 'Knowledge Base Files',
      value: projectStats.knowledgeBaseFiles,
      icon: <Bookmark className="h-5 w-5 text-amber-600" />,
      trend: '+8% from last month',
      trendUp: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <p className={`text-xs mt-1 flex items-center ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : null}
                    {stat.trend}
                  </p>
                </div>
                <div className={`p-2 rounded-full bg-${stat.trendUp ? 'green' : 'red'}-100`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Content Generation Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
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
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Project Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activityData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
