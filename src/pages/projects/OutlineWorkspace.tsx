
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { OutlineEditor } from '@/components/outline/OutlineEditor';
import { ProjectOutline } from '@/types/outline';
import { OutlineService } from '@/services/OutlineService';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const OutlineWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [project, setProject] = useState({
    id: projectId || '',
    name: 'Loading...',
    type: 'Loading...',
    targetLanguage: 'Loading...',
    config: null
  });
  
  const [outline, setOutline] = useState<ProjectOutline | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        console.error('No project ID provided');
        setError('No project ID provided');
        return;
      }
      
      try {
        console.log('Fetching project with ID:', projectId);
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('projects')
          .select('*, project_config(*)')
          .eq('id', projectId)
          .single();
          
        if (error) {
          console.error('Error fetching project:', error);
          setError(`Could not load project details: ${error.message}`);
          toast({
            title: 'Error loading project',
            description: 'Could not load project details',
            variant: 'destructive'
          });
          return;
        }
        
        if (data) {
          console.log('Project data loaded:', data.name);
          setProject({
            id: data.id,
            name: data.name,
            type: data.type,
            targetLanguage: data.target_language,
            config: data.project_config
          });
          
          // Fetch outline
          console.log('Fetching outline for project:', data.id);
          const outlineData = await OutlineService.getOutlineByProject(data.id);
          
          if (outlineData) {
            console.log('Outline found, fetching sections');
            // Fetch sections and items for the outline
            const sections = await OutlineService.getSectionsByOutline(outlineData.id);
            setOutline({
              ...outlineData,
              sections
            });
            console.log('Outline sections loaded:', sections.length);
          } else {
            console.log('No outline exists yet for this project');
            setOutline(null);
          }
        } else {
          console.error('No project data returned');
          setError('No project data returned');
        }
      } catch (error: any) {
        console.error('Error:', error);
        setError(`Failed to load project: ${error.message}`);
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
  }, [projectId, toast, navigate]);
  
  const breadcrumbItems = [
    { label: 'Projects', path: '/projects' },
    { label: project.name, path: `/projects/${projectId}` },
    { label: 'Outline', path: `/projects/${projectId}/outline` }
  ];
  
  const handleSaveOutline = async (updatedOutline: ProjectOutline) => {
    try {
      const savedOutline = await OutlineService.updateOutline(updatedOutline);
      if (savedOutline) {
        // Refresh outline data with sections
        const sections = await OutlineService.getSectionsByOutline(savedOutline.id);
        setOutline({
          ...savedOutline,
          sections
        });
        
        toast({
          title: 'Success',
          description: 'Outline saved successfully',
        });
      }
    } catch (error: any) {
      console.error('Error saving outline:', error);
      toast({
        title: 'Error',
        description: `Failed to save outline: ${error.message}`,
        variant: 'destructive'
      });
    }
  };
  
  const handleGenerateOutline = async () => {
    try {
      if (!project.config) {
        toast({
          title: 'Missing configuration',
          description: 'Project configuration is required to generate an outline',
          variant: 'destructive'
        });
        return;
      }
      
      const generatedOutline = await OutlineService.generateOutlineWithAI(
        project.id, 
        project.config
      );
      
      if (generatedOutline) {
        setOutline(generatedOutline);
        toast({
          title: 'Success',
          description: 'AI outline generated successfully',
        });
      }
    } catch (error: any) {
      console.error('Error generating outline:', error);
      toast({
        title: 'Error',
        description: `Failed to generate outline with AI: ${error.message}`,
        variant: 'destructive'
      });
    }
  };
  
  if (error) {
    return (
      <DashboardLayout contentWidth="wide">
        <div className="pt-4">
          <PageBreadcrumbs items={breadcrumbItems} />
        </div>
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate('/projects')}>
            Return to Projects
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
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
      mainId={`project-${projectId}-outline`}
      aria-label="Project Outline Page"
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
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="outline" />
        
        <div className="mb-6">
          <h2 className={`text-xl font-semibold mb-2 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Project Outline
          </h2>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Create and manage the structure of your project content
          </p>
        </div>
        
        <OutlineEditor 
          outline={outline} 
          projectId={project.id}
          onSave={handleSaveOutline}
          onGenerateOutline={handleGenerateOutline}
        />
      </div>
    </DashboardLayout>
  );
};

export default OutlineWorkspace;
