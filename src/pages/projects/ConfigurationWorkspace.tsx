
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfigData } from '@/components/wizard/types';
import { SystemConfigTab } from '@/components/configuration/SystemConfigTab';
import { ProjectConfigTab } from '@/components/configuration/ProjectConfigTab';
import { LanguageContentTab } from '@/components/configuration/LanguageContentTab';
import { SaveConfigurationButton } from '@/components/configuration/SaveConfigurationButton';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { ProjectBreadcrumbs } from '@/components/project/ProjectBreadcrumbs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const ConfigurationWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { theme } = useTheme();
  const { toast } = useToast();
  const isDark = theme === 'dark';
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const [project, setProject] = useState({
    id: projectId || '',
    name: 'Loading...',
    type: 'Loading...',
    targetLanguage: 'Loading...'
  });
  
  const [configData, setConfigData] = useState<ConfigData>({
    name: '',
    quickStart: 'custom',
    interfaceLanguage: 'English',
    experienceLevel: 'Intermediate',
    interactionMode: 'Guided',
    outputDetail: 'Detailed',
    systemBehavior: 'Balanced',
    projectType: '',
    customProjectType: '',
    subjects: [],
    levels: ['Secondary', 'High School'],
    pedagogy: 'Standard',
    customPedagogy: '',
    wordCount: 5000,
    wordDistribution: 'balanced',
    wordEnforcement: 'flexible',
    targetLanguage: '',
    goal: 'Teaching',
    complexity: 'Intermediate',
    culturalIntegration: 'Moderate',
    terminology: 'Standard',
    markers: 'Standard',
    standards: [],
    customStandards: [],
    structure: 'Default',
    formatting: 'Default',
    scriptType: 'Latin',
    uploadedDocuments: [],
    needsDocumentUpload: false,
    createdDate: new Date().toISOString(),
    lastModified: new Date().toISOString()
  });

  useEffect(() => {
    const fetchProjectAndConfig = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      setSaveError(null);
      
      try {
        // Fetch project data
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (projectError) throw projectError;
        
        if (projectData) {
          setProject({
            id: projectData.id,
            name: projectData.name,
            type: projectData.type,
            targetLanguage: projectData.target_language
          });
          
          // Set basic project info regardless of config presence
          setConfigData(prevData => ({
            ...prevData,
            name: projectData.name,
            projectType: projectData.type,
            targetLanguage: projectData.target_language
          }));
          
          // Check if project_config table exists and has data for this project
          try {
            // Try direct query for the project config
            const { data: configData, error: configError } = await supabase
              .from('project_config')
              .select('*')
              .eq('project_id', projectId)
              .maybeSingle();
              
            if (configError && !configError.message.includes('does not exist')) {
              throw configError;
            }
            
            if (configData) {
              // Update state with existing configuration
              console.log('Found existing configuration:', configData);
              setConfigData(prevData => ({
                ...prevData,
                name: projectData.name,
                projectType: configData.projectType || projectData.type,
                targetLanguage: configData.targetLanguage || projectData.target_language,
                subjects: configData.subjects || [],
                levels: configData.levels || ['Secondary', 'High School'],
                pedagogy: configData.pedagogy || 'Standard',
                complexity: configData.complexity || 'Intermediate',
                lastModified: configData.updated_at || new Date().toISOString()
              }));
            } else {
              console.log('No existing configuration found, using project defaults');
            }
          } catch (err: any) {
            console.error('Error checking config:', err);
            if (!err.message.includes('does not exist') && !err.message.includes('relation')) {
              setSaveError(`Error checking configuration: ${err.message}`);
            }
          }
        }
      } catch (error: any) {
        console.error('Error loading project:', error);
        toast({
          title: 'Error loading project',
          description: 'Failed to load project data',
          variant: 'destructive'
        });
        setSaveError(`Error loading project: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectAndConfig();
  }, [projectId, toast]);

  const updateConfigData = (data: Partial<ConfigData>) => {
    setConfigData({ ...configData, ...data });
    setSaveError(null); // Clear any previous save errors when making changes
  };

  const handleSaveChanges = () => {
    // Updates are now handled in SaveConfigurationButton
    setConfigData({
      ...configData,
      lastModified: new Date().toISOString()
    });
  };

  if (isLoading) {
    return (
      <ModernLayout contentWidth="wide">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout contentWidth="wide">
      <div className="space-y-6">
        <ProjectBreadcrumbs projectName={project.name} />
      
        <ProjectWorkspaceHeader 
          projectName={project.name}
          projectType={project.type}
          targetLanguage={project.targetLanguage}
        />
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="configuration" />
        
        {saveError && (
          <Alert variant="destructive">
            <AlertTitle>Error saving configuration</AlertTitle>
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}
        
        <Card className={isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200 shadow-sm'
        }>
          <CardHeader>
            <CardTitle className={`text-xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Project Configuration
            </CardTitle>
            <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Edit your project settings and parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="system" className="space-y-6">
              <TabsList className={`p-1 w-fit ${
                isDark ? 'bg-slate-700' : 'bg-slate-200'
              }`}>
                <TabsTrigger 
                  value="system" 
                  className={`px-4 ${
                    isDark 
                      ? 'data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white' 
                      : 'data-[state=active]:bg-white text-slate-700 data-[state=active]:text-slate-900'
                  }`}
                >
                  System
                </TabsTrigger>
                <TabsTrigger 
                  value="project" 
                  className={`px-4 ${
                    isDark 
                      ? 'data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white' 
                      : 'data-[state=active]:bg-white text-slate-700 data-[state=active]:text-slate-900'
                  }`}
                >
                  Project
                </TabsTrigger>
                <TabsTrigger 
                  value="language" 
                  className={`px-4 ${
                    isDark 
                      ? 'data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white' 
                      : 'data-[state=active]:bg-white text-slate-700 data-[state=active]:text-slate-900'
                  }`}
                >
                  Language & Content
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="system">
                <SystemConfigTab configData={configData} updateConfigData={updateConfigData} />
              </TabsContent>
              
              <TabsContent value="project">
                <ProjectConfigTab configData={configData} updateConfigData={updateConfigData} />
              </TabsContent>
              
              <TabsContent value="language">
                <LanguageContentTab configData={configData} updateConfigData={updateConfigData} />
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 flex justify-end">
              <SaveConfigurationButton 
                onSave={handleSaveChanges} 
                projectId={project.id}
                configData={configData}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernLayout>
  );
};

export default ConfigurationWorkspace;
