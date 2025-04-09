
import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectOverviewInfo } from '@/components/project/ProjectOverviewInfo';
import { ProjectActivityFeed } from '@/components/project/ProjectActivityFeed';
import { ProjectQuickActions } from '@/components/project/ProjectQuickActions';
import { ProjectResources } from '@/components/project/ProjectResources';
import { Project } from '@/types/supabase-custom';
import { useTheme } from '@/contexts/ThemeContext';

// Lazy load the analytics component for better performance
const ProjectAnalyticsExport = lazy(() => 
  import('@/components/analytics/ProjectAnalyticsExport').then(module => ({ 
    default: module.ProjectAnalyticsExport 
  }))
);

interface ProjectWorkspaceContentProps {
  project: Project;
  projectId: string;
  activityItems: { action: string; time: string; icon: any }[];
  quickActions: {
    title: string;
    description: string;
    icon: any;
    path: string;
    primary?: boolean;
  }[];
}

export const ProjectWorkspaceContent: React.FC<ProjectWorkspaceContentProps> = ({
  project,
  projectId,
  activityItems,
  quickActions
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="space-y-6">
      {/* Project Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Info & Progress */}
        <ProjectOverviewInfo 
          project={{
            progress: project.progress,
            description: project.description || '',
            deadline: project.deadline || 'Not set',
            lastModified: project.lastModified,
            owner: project.owner || 'Unknown'
          }} 
        />
        
        {/* Activity feed */}
        <ProjectActivityFeed activityItems={activityItems} />
      </div>
      
      {/* Analytics & Exports Section */}
      <ErrorBoundary>
        <Suspense fallback={<Skeleton className={`w-full h-[200px] ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />}>
          <ProjectAnalyticsExport projectId={projectId} />
        </Suspense>
      </ErrorBoundary>
      
      {/* Quick Actions Grid */}
      <ProjectQuickActions 
        projectId={project.id} 
        quickActions={quickActions} 
      />
      
      {/* Project Resources Section */}
      <ProjectResources projectId={project.id} />
    </div>
  );
};
