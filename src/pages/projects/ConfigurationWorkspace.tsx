
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

export const ConfigurationWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [project, setProject] = useState({
    id: projectId || '',
    name: 'Loading...',
    type: 'Loading...',
    targetLanguage: 'Loading...'
  });
  
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setProject({
            id: data.id,
            name: data.name,
            type: data.type,
            targetLanguage: data.target_language
          });
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    
    fetchProject();
  }, [projectId]);
  
  const [configData, setConfigData] = useState<ConfigData>({
    name: project.name,
    quickStart: 'custom',
    
    interfaceLanguage: 'English',
    experienceLevel: 'Intermediate',
    interactionMode: 'Guided',
    outputDetail: 'Detailed',
    systemBehavior: 'Balanced',
    
    projectType: project.type,
    customProjectType: '',
    subjects: [],
    levels: ['Secondary', 'High School'],
    pedagogy: 'Standard',
    customPedagogy: '',
    wordCount: 5000,
    wordDistribution: 'balanced',
    wordEnforcement: 'flexible',
    
    targetLanguage: project.targetLanguage,
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

  // Update configData when project data is fetched
  useEffect(() => {
    if (project.name !== 'Loading...') {
      setConfigData(prevData => ({
        ...prevData,
        name: project.name,
        projectType: project.type,
        targetLanguage: project.targetLanguage
      }));
    }
  }, [project]);

  const updateConfigData = (data: Partial<ConfigData>) => {
    setConfigData({ ...configData, ...data });
  };

  const handleSaveChanges = () => {
    // Here you would typically save the configuration to the backend
    setConfigData({
      ...configData,
      lastModified: new Date().toISOString()
    });
  };

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
              <SaveConfigurationButton onSave={handleSaveChanges} />
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernLayout>
  );
};

export default ConfigurationWorkspace;
