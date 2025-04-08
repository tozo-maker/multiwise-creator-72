
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'completed' | 'in-review';
  lastModified: string;
}

export const ContentWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Mock project data - would normally be fetched based on ID
  const project = {
    id: projectId || '1',
    name: 'Spanish Language Textbook',
    type: 'Textbook',
    targetLanguage: 'Spanish',
    lastModified: '2 hours ago',
    progress: 65
  };
  
  // Mock content items
  const [contentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Introduction to Spanish Greetings',
      type: 'Lesson',
      status: 'completed',
      lastModified: '2 days ago'
    },
    {
      id: '2',
      title: 'Present Tense Conjugation',
      type: 'Grammar Reference',
      status: 'completed',
      lastModified: '1 week ago'
    },
    {
      id: '3',
      title: 'Basic Vocabulary - Food and Drinks',
      type: 'Vocabulary',
      status: 'draft',
      lastModified: '3 hours ago'
    },
    {
      id: '4',
      title: 'Practice Exercise - Greetings',
      type: 'Exercise',
      status: 'in-review',
      lastModified: '5 days ago'
    }
  ]);
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in-review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const breadcrumbItems = [
    { label: 'Projects', path: '/projects' },
    { label: project.name, path: `/projects/${projectId}` },
    { label: 'Content' }
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
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="content" />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Content Items</h2>
              <Button
                onClick={() => navigate(`/projects/${projectId}/content/new`)}
                size={isMobile ? "sm" : "default"}
                className="gap-2 bg-brand-500 hover:bg-brand-600 text-white"
              >
                <Plus className="h-4 w-4" />
                New Content
              </Button>
            </div>
            
            {contentItems.length > 0 ? (
              <div className="space-y-3">
                {contentItems.map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:border-brand-200 dark:hover:border-brand-800 transition-colors dark:bg-slate-800 dark:border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="h-10 w-10 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900 dark:text-slate-100">{item.title}</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-xs text-slate-500 dark:text-slate-400">{item.type}</span>
                              <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">Last modified {item.lastModified}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadgeClass(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                    <FilePlus className="h-6 w-6 text-slate-400 dark:text-slate-300" />
                  </div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">No content items yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                    Start creating educational content for your project
                  </p>
                  <Button 
                    onClick={() => navigate(`/projects/${projectId}/content/new`)}
                    className="gap-2 bg-brand-500 hover:bg-brand-600 text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Create Content
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-slate-100">Quick Content Creation</CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Generate new content with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full justify-start gap-2 mb-3 bg-brand-500 hover:bg-brand-600 text-white" 
                  onClick={() => navigate(`/projects/${projectId}/content/new`)}
                >
                  <Plus className="h-4 w-4" />
                  New Chapter/Section
                </Button>
                
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Content templates:
                </div>
                
                <div className="space-y-2">
                  {[
                    { name: 'Vocabulary List', description: 'Create a themed vocabulary list' },
                    { name: 'Grammar Explanation', description: 'Explain a grammar concept' },
                    { name: 'Practice Exercise', description: 'Generate practice activities' },
                    { name: 'Cultural Note', description: 'Add cultural context' },
                  ].map((template, i) => (
                    <Button 
                      key={i}
                      variant="outline" 
                      className="w-full justify-start h-auto py-3 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                      onClick={() => navigate(`/projects/${projectId}/content/new`)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{template.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default ContentWorkspace;
