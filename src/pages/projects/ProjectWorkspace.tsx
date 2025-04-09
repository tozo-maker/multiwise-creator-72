
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { FileText, LineChart, Sparkles, CalendarClock, FileBox } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';

// Import our components
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const [project, setProject] = useState({
    id: projectId || '',
    name: 'Loading...',
    type: 'Loading...',
    targetLanguage: 'Loading...',
    description: '',
    lastModified: '',
    progress: 0,
    owner: '',
    deadline: 'Not set' // Include deadline property
  });
  
  useEffect(() => {
    async function fetchProjectData() {
      if (!projectId) {
        navigate('/projects');
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (error) {
          console.error('Error fetching project:', error);
          toast({
            title: 'Error loading project',
            description: 'Could not load project details',
            variant: 'destructive'
          });
          navigate('/projects');
          return;
        }
        
        if (data) {
          setProject({
            id: data.id,
            name: data.name,
            type: data.type,
            targetLanguage: data.target_language,
            description: data.description || '',
            lastModified: new Date(data.updated_at).toLocaleDateString(),
            progress: data.progress || 0,
            owner: data.user_id || '',
            deadline: data.deadline || 'Not set' // Set deadline from data or default
          });
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project details',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProjectData();
  }, [projectId, toast, navigate]);
  
  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: project.name }
  ];
  
  // Activity feed items - fetch these from Supabase in a real implementation
  const activityItems = [
    { action: 'Project created', time: project.lastModified, icon: FileText }
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
  
  if (isLoading) {
    return (
      <ModernLayout contentWidth="wide">
        <div className="space-y-6 pt-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </ModernLayout>
    );
  }
  
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
    </ModernLayout>
  );
};

export default ProjectWorkspace;
