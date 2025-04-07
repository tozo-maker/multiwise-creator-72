
import React from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { ProjectOverviewCards } from '@/components/project/ProjectOverviewCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Plus, LineChart, Sparkles, Calendar, FileText } from 'lucide-react';
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
    progress: 65,
    description: 'A comprehensive Spanish language textbook for beginners, focusing on vocabulary, grammar, and conversational skills.',
    deadline: 'October 15, 2023',
    owner: 'Sarah Johnson'
  };
  
  const breadcrumbItems = [
    { label: 'Projects', path: '/projects' },
    { label: project.name }
  ];
  
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
        
        <div className="mb-6">
          <Card className="border border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold">Project Overview</CardTitle>
              <CardDescription>Key metrics and information about this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-500">Project Progress</h3>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{project.progress}% Complete</span>
                    <span className="text-xs text-slate-500">Target: 100%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  
                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Project Information</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="text-slate-500">Description:</div>
                      <div className="text-slate-800">{project.description}</div>
                      <div className="text-slate-500">Deadline:</div>
                      <div className="text-slate-800">{project.deadline}</div>
                      <div className="text-slate-500">Owner:</div>
                      <div className="text-slate-800">{project.owner}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-500">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button className="w-full justify-between bg-brand-500 hover:bg-brand-600 text-white">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Create New Content
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button className="w-full justify-between" variant="outline">
                      <div className="flex items-center gap-2">
                        <LineChart className="h-4 w-4" />
                        Run Analysis
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button className="w-full justify-between" variant="outline">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Schedule Review
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'Content updated', time: '2 hours ago' },
                      { action: 'Analysis completed', time: '1 day ago' },
                      { action: 'File added to knowledge base', time: '2 days ago' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start pb-2 border-b border-slate-100 last:border-b-0">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <FileText className="h-3.5 w-3.5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{item.action}</p>
                          <p className="text-xs text-slate-500">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <ProjectOverviewCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border border-slate-200 hover:shadow-sm transition-shadow">
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
          
          <Card className="border border-slate-200 hover:shadow-sm transition-shadow">
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
                
                <Button className="gap-2 w-full justify-between" variant="outline">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Files to Knowledge Base
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-slate-200 hover:shadow-sm transition-shadow">
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
                
                <Button className="gap-2 w-full justify-between" variant="outline">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4" />
                    Run Analysis
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-slate-200 hover:shadow-sm transition-shadow">
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
                
                <Button className="gap-2 w-full justify-between" variant="outline">
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
    </ModernLayout>
  );
};

export default ProjectWorkspace;
