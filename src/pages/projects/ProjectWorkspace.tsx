
import React, { Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, FileText, LineChart, Sparkles, CalendarClock, FileBox, AlertCircle, Download } from 'lucide-react';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

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
          <Card className="md:col-span-2 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress bar section */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{project.progress}% Complete</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Target: 100%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                {/* Project metadata */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2 text-sm pt-2">
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Description</div>
                  <div className="text-slate-800 dark:text-slate-200">{project.description}</div>
                  
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Deadline</div>
                  <div className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <CalendarClock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    {project.deadline}
                  </div>
                  
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Last modified</div>
                  <div className="text-slate-800 dark:text-slate-200">{project.lastModified}</div>
                  
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Owner</div>
                  <div className="text-slate-800 dark:text-slate-200">{project.owner}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Activity feed */}
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityItems.map((item, i) => (
                  <div key={i} className="flex items-start pb-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 flex-shrink-0">
                      <item.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.action}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Analytics & Exports Section */}
        <ErrorBoundary>
          <Suspense fallback={<Skeleton className="w-full h-[200px]" />}>
            <ProjectAnalyticsExport projectId={projectId} />
          </Suspense>
        </ErrorBoundary>
        
        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className={`border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow overflow-hidden ${
                  action.primary ? 'border-l-4 border-l-brand-500' : ''
                }`}
              >
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-md mr-3 ${
                      action.primary ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{action.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    asChild
                    variant={action.primary ? "default" : "outline"}
                    className={`w-full justify-between ${
                      action.primary ? 'bg-brand-500 hover:bg-brand-600 text-white' : ''
                    }`}
                  >
                    <Link to={action.path}>
                      <span>Get Started</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Project Resources Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Project Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Content Section */}
            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Content</CardTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0">
                        <Link to={`/projects/${projectId}/content`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Go to Content</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 pb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Create and manage educational content for your project.
                </p>
                <Button asChild variant="outline" size="sm" className="w-full justify-between">
                  <Link to={`/projects/${projectId}/content/new`}>
                    <span>Create New Content</span>
                    <FileText className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Knowledge Base */}
            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Knowledge Base</CardTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0">
                        <Link to={`/projects/${projectId}/knowledge-base`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Go to Knowledge Base</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 pb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Manage reference materials and context files for your project.
                </p>
                <Button asChild variant="outline" size="sm" className="w-full justify-between">
                  <Link to={`/projects/${projectId}/knowledge-base`}>
                    <span>Manage Knowledge Base</span>
                    <FileBox className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Snapshots */}
            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Snapshots</CardTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0">
                        <Link to={`/projects/${projectId}/snapshots`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Go to Snapshots</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 pb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  View and restore previous versions of your project content.
                </p>
                <Button asChild variant="outline" size="sm" className="w-full justify-between">
                  <Link to={`/projects/${projectId}/snapshots`}>
                    <span>View Snapshots</span>
                    <AlertCircle className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default ProjectWorkspace;
