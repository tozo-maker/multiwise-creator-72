
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/supabase-custom';
import { ProjectBreadcrumbs } from '@/components/project/ProjectBreadcrumbs';
import { ProjectWorkspaceContent } from '@/components/project/ProjectWorkspaceContent';
import { ProjectWorkspaceSkeleton } from '@/components/project/ProjectWorkspaceSkeleton';
import { useProjectQuickActions } from '@/components/project/ProjectWorkspaceActions';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const ProjectWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const [project, setProject] = useState<Project>({
    id: projectId || '',
    name: 'Loading...',
    type: 'Loading...',
    targetLanguage: 'Loading...',
    description: '',
    lastModified: '',
    progress: 0,
    owner: '',
    deadline: 'Not set'
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
            deadline: data.deadline || 'Not set',
            status: data.status
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

  // Activity feed items - We'll fetch from Supabase in the future
  const activityItems = [
    { action: 'Project created', time: project.lastModified, icon: FileText }
  ];

  // Get quick actions for the project
  const quickActions = useProjectQuickActions(project.id);
  
  if (isLoading) {
    return (
      <ModernLayout contentWidth="wide">
        <ProjectWorkspaceSkeleton />
      </ModernLayout>
    );
  }
  
  return (
    <ModernLayout contentWidth="wide">
      <ProjectBreadcrumbs projectName={project.name} />
      
      <ThemeCard className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
          <CardDescription>
            {project.type} project in {project.targetLanguage}
          </CardDescription>
        </CardHeader>
      </ThemeCard>
      
      <ProjectWorkspaceTabs projectId={project.id} />
      
      <ProjectWorkspaceContent
        project={project}
        projectId={project.id}
        activityItems={activityItems}
        quickActions={quickActions}
      />
    </ModernLayout>
  );
};

export default ProjectWorkspace;
