
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
import { AlertCircle, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DatabaseService } from '@/services/DatabaseService';
import { ConfigData } from '@/components/wizard/types';

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
  const [isCreatingOutline, setIsCreatingOutline] = useState(false);
  const [configMissing, setConfigMissing] = useState(false);
  const [configData, setConfigData] = useState<ConfigData | null>(null);
  
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
        setConfigMissing(false);
        
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (projectError) {
          console.error('Error fetching project:', projectError);
          setError(`Could not load project details: ${projectError.message}`);
          toast({
            title: 'Error loading project',
            description: 'Could not load project details',
            variant: 'destructive'
          });
          return;
        }
        
        if (projectData) {
          console.log('Project data loaded:', projectData.name);
          
          setProject({
            id: projectData.id,
            name: projectData.name,
            type: projectData.type,
            targetLanguage: projectData.target_language,
            config: null
          });

          try {
            // Fetch project configuration using the enhanced DatabaseService
            const projectConfig = await DatabaseService.getProjectConfig(projectId);
            
            if (!projectConfig) {
              console.log('No configuration found for this project');
              setConfigMissing(true);
              setConfigData(null);
            } else {
              console.log('Project configuration found:', projectConfig);
              setConfigMissing(false);
              setConfigData(projectConfig);
              
              // Fetch outline if config exists
              const outlineData = await OutlineService.getOutlineByProject(projectData.id);
              
              if (outlineData) {
                console.log('Outline found, fetching sections');
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
            }
          } catch (configError: any) {
            console.error('Error checking project configuration:', configError);
            if (!configError.message?.includes('does not exist') && 
                !configError.message?.includes('relation')) {
              setError(`Error checking configuration: ${configError.message}`);
            } else {
              setConfigMissing(true);
            }
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
      if (configMissing) {
        toast({
          title: 'Configuration Required',
          description: 'Please set up project configuration first before creating an outline',
          variant: 'destructive'
        });
        navigate(`/projects/${projectId}/configuration`);
        return;
      }
      
      console.log('Saving outline:', updatedOutline);
      const savedOutline = await OutlineService.updateOutline(updatedOutline);
      if (savedOutline) {
        const sections = await OutlineService.getSectionsByOutline(savedOutline.id);
        setOutline({
          ...savedOutline,
          sections
        });
        
        toast({
          title: 'Success',
          description: 'Outline saved successfully',
        });
      } else {
        throw new Error('Failed to save outline');
      }
    } catch (error: any) {
      console.error('Error saving outline:', error);
      toast({
        title: 'Error',
        description: `Failed to save outline: ${error.message}`,
        variant: 'destructive'
      });
      throw error; // Rethrow to handle in the component
    }
  };
  
  const handleCreateOutline = async () => {
    try {
      if (configMissing) {
        toast({
          title: 'Configuration Required',
          description: 'Please set up project configuration first before creating an outline',
          variant: 'destructive'
        });
        navigate(`/projects/${projectId}/configuration`);
        return;
      }
      
      setIsCreatingOutline(true);
      console.log('Creating new outline manually for project:', projectId);
      
      if (!projectId) {
        toast({
          title: 'Missing project ID',
          description: 'Project ID is required to create an outline',
          variant: 'destructive'
        });
        throw new Error('Missing project ID');
      }
      
      const newOutline = await OutlineService.createOutline(
        projectId,
        'Project Outline',
        'Main outline for the project'
      );
      
      if (newOutline) {
        const updatedOutline = {
          ...newOutline,
          sections: []
        };
        
        setOutline(updatedOutline);
        
        toast({
          title: 'Success',
          description: 'New outline created successfully',
        });
      } else {
        throw new Error('Failed to create outline');
      }
    } catch (error: any) {
      console.error('Error creating outline:', error);
      toast({
        title: 'Error',
        description: `Failed to create outline: ${error.message}`,
        variant: 'destructive'
      });
      throw error; // Rethrow for component-level handling
    } finally {
      setIsCreatingOutline(false);
    }
  };
  
  const handleGenerateOutline = async () => {
    try {
      if (configMissing || !configData) {
        toast({
          title: 'Configuration Required',
          description: 'Please set up project configuration first before generating content.',
          variant: 'destructive'
        });
        navigate(`/projects/${projectId}/configuration`);
        return;
      }
      
      setIsCreatingOutline(true);
      console.log('Starting AI outline generation');
      if (!project.id) {
        toast({
          title: 'Missing project ID',
          description: 'Project ID is required to generate an outline',
          variant: 'destructive'
        });
        throw new Error('Missing project ID');
      }
      
      // We already have the config data loaded, use it directly
      console.log('Using loaded config data for AI generation:', configData);
      
      const enhancedConfig = {
        name: project.name,
        projectType: project.type || 'course',
        targetLanguage: project.targetLanguage || 'English',
        subjects: configData.subjects || ['General'],
        levels: configData.levels || ['Beginner'],
        pedagogy: configData.pedagogy || 'Standard',
        complexity: configData.complexity || 'Intermediate',
        ...configData
      };
      
      console.log('Enhanced config for AI generation:', enhancedConfig);
      
      const generatedOutline = await OutlineService.generateOutlineWithAI(
        project.id, 
        enhancedConfig
      );
      
      if (generatedOutline) {
        const sections = await OutlineService.getSectionsByOutline(generatedOutline.id);
        setOutline({
          ...generatedOutline,
          sections
        });
        
        toast({
          title: 'Success',
          description: 'AI outline generated successfully',
        });
      } else {
        throw new Error('Failed to generate outline');
      }
    } catch (error: any) {
      console.error('Error generating outline:', error);
      toast({
        title: 'Error',
        description: `Failed to generate outline with AI: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setIsCreatingOutline(false);
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

  if (configMissing) {
    return (
      <DashboardLayout contentWidth="wide">
        <div className="pt-4">
          <PageBreadcrumbs items={breadcrumbItems} />
        </div>
        
        <ProjectWorkspaceHeader 
          projectName={project.name}
          projectType={project.type}
          targetLanguage={project.targetLanguage}
        />
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="outline" />
        
        <div className="mt-8">
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-800">Configuration Required</AlertTitle>
            <AlertDescription className="text-amber-700">
              Please set up your project configuration first before creating an outline.
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={() => navigate(`/projects/${projectId}/configuration`)}
              className="gap-2"
            >
              <Settings size={16} />
              Go to Project Configuration
            </Button>
          </div>
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
          <PageBreadcrumbs items={[
            { label: 'Projects', path: '/projects' },
            { label: project.name, path: `/projects/${projectId}` },
            { label: 'Outline', path: `/projects/${projectId}/outline` }
          ]} />
        </div>
        
        <ProjectWorkspaceHeader 
          projectName={project.name}
          projectType={project.type}
          targetLanguage={project.targetLanguage}
        />
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="outline" />
        
        <>
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
            onCreateOutline={handleCreateOutline}
          />
        </>
      </div>
    </DashboardLayout>
  );
};

export default OutlineWorkspace;
