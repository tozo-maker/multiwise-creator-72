
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfigData } from '@/components/wizard/types';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { SystemConfigTab } from '@/components/configuration/SystemConfigTab';
import { ProjectConfigTab } from '@/components/configuration/ProjectConfigTab';
import { LanguageContentTab } from '@/components/configuration/LanguageContentTab';
import { SaveConfigurationButton } from '@/components/configuration/SaveConfigurationButton';

export const ConfigurationWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  const project = {
    id: projectId || '1',
    name: 'Spanish Language Textbook',
    type: 'Textbook',
    targetLanguage: 'Spanish',
    lastModified: '2 hours ago',
    progress: 65
  };
  
  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: project.name, path: `/projects/${projectId}` },
    { label: 'Configuration' }
  ];
  
  const [configData, setConfigData] = useState<ConfigData>({
    name: 'Spanish Language Textbook',
    quickStart: 'custom',
    
    interfaceLanguage: 'English',
    experienceLevel: 'Intermediate',
    interactionMode: 'Guided',
    outputDetail: 'Detailed',
    systemBehavior: 'Balanced',
    
    projectType: 'Textbook',
    customProjectType: '',
    subjects: ['Spanish', 'Language Arts'],
    levels: ['Secondary', 'High School'],
    pedagogy: 'Standard',
    customPedagogy: '',
    wordCount: 5000,
    wordDistribution: 'balanced',
    wordEnforcement: 'flexible',
    
    targetLanguage: 'Spanish',
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
        <div className="pt-4">
          <PageBreadcrumbs items={breadcrumbItems} />
        </div>
      
        <ProjectWorkspaceHeader 
          projectName={project.name}
          projectType={project.type}
          targetLanguage={project.targetLanguage}
        />
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="configuration" />
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-slate-100">Project Configuration</CardTitle>
            <CardDescription className="text-slate-400">
              Edit your project settings and parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="system" className="space-y-6">
              <TabsList className="bg-slate-700 p-1 w-fit">
                <TabsTrigger value="system" className="data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white px-4">System</TabsTrigger>
                <TabsTrigger value="project" className="data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white px-4">Project</TabsTrigger>
                <TabsTrigger value="language" className="data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white px-4">Language & Content</TabsTrigger>
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
