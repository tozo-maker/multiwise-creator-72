
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { ContentCreationForm } from '@/components/project/ContentCreationForm';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const ContentCreation = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [project, setProject] = useState({
    id: projectId || '',
    name: 'Loading...',
    type: 'Loading...',
    targetLanguage: 'Loading...'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
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
          return;
        }
        
        if (data) {
          setProject({
            id: data.id,
            name: data.name,
            type: data.type,
            targetLanguage: data.target_language
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
    };
    
    fetchProject();
  }, [projectId, toast]);
  
  const breadcrumbItems = [
    { label: 'Projects', path: '/projects' },
    { label: project.name, path: `/projects/${projectId}` },
    { label: 'Content', path: `/projects/${projectId}/content` },
    { label: 'Create Content' }
  ];
  
  if (isLoading) {
    return (
      <DashboardLayout contentWidth="wide">
        <div className="space-y-6 pt-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout 
      contentWidth="wide"
      mainId={`project-${projectId}-content-creation`}
      aria-label="Content Creation Page"
    >
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
        
        <div className="mb-6">
          <h2 className={`text-xl font-semibold mb-2 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Create Content
          </h2>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Generate new content with AI assistance using your project configuration and knowledge base.
          </p>
        </div>
        
        <ContentCreationForm />
      </div>
    </DashboardLayout>
  );
};

export default ContentCreation;
