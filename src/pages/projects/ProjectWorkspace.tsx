
import React, { Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { FileText, LineChart, Sparkles, CalendarClock, FileBox } from 'lucide-react';

// Import our new components
import { ProjectActivityFeed } from '@/components/project/ProjectActivityFeed';
import { ProjectOverviewInfo } from '@/components/project/ProjectOverviewInfo';
import { ProjectQuickActions } from '@/components/project/ProjectQuickActions';
import { ProjectResources } from '@/components/project/ProjectResources';

// Lazy load the analytics component for better performance
const ProjectAnalyticsExport = lazy(() => 
  import('@/components/analytics/ProjectAnalyticsExport').then(module => ({ 
    default: module.ProjectAnalyticsExport 
  }))
);

export const ProjectWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  // Mock project data - would normally be fetched based on ID
  const project = {
    id: projectId || '1',
    name: 'Spanish Language Textbook',
    type: 'Textbook',
    targetLanguage: 'Spanish',
    lastModified: '2 hours ago',
    progress: 65,
    description: 'A comprehensive Spanish language textbook for beginners, focusing on vocabulary, grammar, and conversational skills.',
    deadline: 'October 15, 2023',
    owner: 'Sarah Johnson'
  };
  
  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: project.name }
  ];
  
  // Activity feed items
  const activityItems = [
    { action: 'Content updated', time: '2 hours ago', icon: FileText },
    { action: 'Analysis completed', time: '1 day ago', icon: LineChart },
    { action: 'File added to knowledge base', time: '2 days ago', icon: FileBox }
  ];

  // Quick actions for the project
  const quickActions = [
    { 
      title: "Create Content", 
      description: "Create new educational content", 
      icon: FileText,
      path: `/projects/${projectId}/content/new`,
      primary: true
    },
    { 
      title: "Run Analysis", 
      description: "Analyze your content", 
      icon: LineChart,
      path: `/projects/${projectId}/analysis` 
    },
    { 
      title: "Schedule Review", 
      description: "Set up a content review", 
      icon: CalendarClock,
      path: "#" 
    },
    { 
      title: "AI Enhancements", 
      description: "Get AI suggestions", 
      icon: Sparkles,
      path: `/projects/${projectId}/enhancements` 
    }
  ];
  
  const handleExportProject = () => {
    toast({
      title: "Export initiated",
      description: "Your project is being prepared for export.",
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Project exported successfully.",
      });
    }, 1500);
  };
  
  return (
    <ModernLayout contentWidth="wide">
      <div className="space-y-6">
        <div className="pt-4">
          <PageBreadcrumbs items={breadcrumbItems} />
        </div>
        
        <ProjectWorkspaceHeader 
          projectName={project.name}
          projectType={project.type}
          targetLanguage={project.targetLanguage}
        />
        
        <ProjectWorkspaceTabs projectId={project.id} />
        
        {/* Project Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Project Info & Progress */}
          <ProjectOverviewInfo project={project} />
          
          {/* Activity feed */}
          <ProjectActivityFeed activityItems={activityItems} />
        </div>
        
        {/* Analytics & Exports Section */}
        <ErrorBoundary>
          <Suspense fallback={<Skeleton className="w-full h-[200px]" />}>
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
    </ModernLayout>
  );
};

export default ProjectWorkspace;
