
import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { ProjectActivityChart } from './stats/ProjectActivityChart';
import { ContentGenerationChart } from './stats/ContentGenerationChart';
import { StatCard } from './stats/StatCard';
import { Book, FileText, GitBranch, Users, BarChart3, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LucideProps } from 'lucide-react';

interface DashboardStatsProps {
  className?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const DashboardStats = ({ className, onRefresh, isRefreshing = false }: DashboardStatsProps) => {
  const { projectStats, activityData, contentGenerationData } = useDashboard();

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Dashboard Analytics</h2>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Projects"
          value={projectStats.totalProjects}
          icon={<Book />}
          trend="up"
          trendUp={projectStats.totalProjects > 0}
          trendValue={projectStats.totalProjects > 0 ? "+1" : "0"}
          backgroundColor="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          ariaLabel={`Total projects: ${projectStats.totalProjects}`}
        />
        <StatCard 
          title="Active Projects"
          value={projectStats.activeProjects}
          icon={<GitBranch />}
          trend="up"
          trendUp={projectStats.activeProjects > 0}
          trendValue={projectStats.activeProjects > 0 ? "+1" : "0"}
          backgroundColor="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
          ariaLabel={`Active projects: ${projectStats.activeProjects}`}
        />
        <StatCard 
          title="Content Items"
          value={projectStats.contentCount}
          icon={<FileText />}
          trend="up"
          trendUp={projectStats.contentCount > 0}
          trendValue={projectStats.contentCount > 0 ? "+1" : "0"}
          backgroundColor="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
          ariaLabel={`Content items: ${projectStats.contentCount}`}
        />
        <StatCard 
          title="Reference Files"
          value={projectStats.knowledgeBaseFiles}
          icon={<BarChart3 />}
          trend="up"
          trendUp={projectStats.knowledgeBaseFiles > 0}
          trendValue={projectStats.knowledgeBaseFiles > 0 ? "+1" : "0"}
          backgroundColor="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
          ariaLabel={`Reference files: ${projectStats.knowledgeBaseFiles}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ProjectActivityChart data={activityData} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ContentGenerationChart data={contentGenerationData} />
        </motion.div>
      </div>
    </div>
  );
};
