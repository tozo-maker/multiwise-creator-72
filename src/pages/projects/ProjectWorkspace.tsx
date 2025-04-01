
import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { ProjectOverviewCards } from '@/components/project/ProjectOverviewCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, LineChart, Sparkles } from 'lucide-react';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';

export const ProjectWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  // Mock project data - would normally be fetched based on ID
  const project = {
    id: projectId || '1',
    name: 'Spanish Language Textbook',
    type: 'Textbook',
    targetLanguage: 'Spanish',
    lastModified: '2 hours ago',
    progress: 65
  };
  
  const breadcrumbItems = [
    { label: 'Projects', path: '/projects' },
    { label: project.name }
  ];
  
  return (
    <MainLayout contentWidth="wide">
      <div className="space-y-6">
        <div className="py-4">
          <PageBreadcrumbs items={breadcrumbItems} />
        </div>
        
        <ProjectWorkspaceHeader 
          projectName={project.name}
          projectType={project.type}
          targetLanguage={project.targetLanguage}
        />
        
        <ProjectWorkspaceTabs projectId={project.id} />
        
        <ProjectOverviewCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Create and manage your educational content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  Start creating chapters, sections or other content units.
                </p>
                
                <Button className="gap-2 w-full justify-between bg-brand-500 hover:bg-brand-600 text-white">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Content
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>
                Manage context files for your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  Upload curriculum standards, style guides, and other context materials.
                </p>
                
                <Button className="gap-2 w-full justify-between bg-brand-500 hover:bg-brand-600 text-white" variant="outline">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Files to Knowledge Base
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Analysis</CardTitle>
              <CardDescription>
                Analyze your educational content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  Get insights into readability, alignment with standards, and more.
                </p>
                
                <Button className="gap-2 w-full justify-between bg-brand-500 hover:bg-brand-600 text-white" variant="outline">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4" />
                    Run Analysis
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Enhancements</CardTitle>
              <CardDescription>
                Improve your content with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  Get suggestions for improvements and enhancements to your content.
                </p>
                
                <Button className="gap-2 w-full justify-between bg-brand-500 hover:bg-brand-600 text-white" variant="outline">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate Enhancements
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
