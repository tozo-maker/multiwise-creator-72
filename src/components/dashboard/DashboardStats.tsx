
import React from 'react';
import { 
  BookText, 
  Activity, 
  FileText,
  Bookmark
} from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { StatCard } from './stats/StatCard';
import { ContentGenerationChart } from './stats/ContentGenerationChart';
import { ProjectActivityChart } from './stats/ProjectActivityChart';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Memoized stats component for better performance
export const DashboardStats: React.FC = React.memo(() => {
  const { projectStats, activityData, contentGenerationData, isLoading } = useDashboard();

  const statCards = [
    {
      title: 'Total Projects',
      value: projectStats.totalProjects,
      icon: <BookText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />,
      trend: '+12% from last month',
      trendUp: true,
      backgroundColor: 'bg-indigo-50 dark:bg-indigo-950/30',
      ariaLabel: 'Total projects count'
    },
    {
      title: 'Active Projects',
      value: projectStats.activeProjects,
      icon: <Activity className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />,
      trend: '+5% from last month',
      trendUp: true,
      backgroundColor: 'bg-green-50 dark:bg-green-950/30',
      ariaLabel: 'Active projects count'
    },
    {
      title: 'Content Created',
      value: projectStats.contentCount,
      icon: <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />,
      trend: '+25% from last month',
      trendUp: true,
      backgroundColor: 'bg-blue-50 dark:bg-blue-950/30',
      ariaLabel: 'Content items count'
    },
    {
      title: 'Knowledge Base Files',
      value: projectStats.knowledgeBaseFiles,
      icon: <Bookmark className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />,
      trend: '+8% from last month',
      trendUp: true,
      backgroundColor: 'bg-amber-50 dark:bg-amber-950/30',
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

  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard statistics">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-1/2 mb-4 dark:bg-slate-700" />
                <Skeleton className="h-8 w-1/3 mb-4 dark:bg-slate-700" />
                <Skeleton className="h-4 w-2/3 dark:bg-slate-700" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1 dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-1/3 dark:bg-slate-700" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[240px] w-full dark:bg-slate-700" />
            </CardContent>
          </Card>

          <Card className="col-span-1 dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-1/3 dark:bg-slate-700" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[240px] w-full dark:bg-slate-700" />
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
      aria-label="Dashboard statistics"
      role="region"
    >
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendUp={stat.trendUp}
            backgroundColor={stat.backgroundColor}
            ariaLabel={stat.ariaLabel}
          />
        ))}
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentGenerationChart data={contentGenerationData} />
        <ProjectActivityChart data={activityData} />
      </motion.div>
    </motion.div>
  );
});

DashboardStats.displayName = 'DashboardStats';
