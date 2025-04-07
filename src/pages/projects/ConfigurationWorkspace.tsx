
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectConfigStep } from '@/components/wizard/steps/ProjectConfigStep';
import { SystemConfigStep } from '@/components/wizard/steps/SystemConfigStep';
import { LanguageConfigStep } from '@/components/wizard/steps/LanguageConfigStep';
import { useToast } from '@/hooks/use-toast';
import { ConfigData } from '@/components/wizard/types';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';

export const ConfigurationWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  
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
    { label: project.name, path: `/projects/${projectId}` },
    { label: 'Configuration' }
  ];
  
  // Mock configuration data that would be retrieved from the backend
  const [configData, setConfigData] = useState<ConfigData>({
    // Project Info
    name: 'Spanish Language Textbook',
    quickStart: 'custom',
    
    // System Config
    interfaceLanguage: 'English',
    experienceLevel: 'Intermediate',
    interactionMode: 'Guided',
    outputDetail: 'Detailed',
    systemBehavior: 'Balanced',
    
    // Project Config
    projectType: 'Textbook',
    customProjectType: '',
    subjects: ['Spanish', 'Language Arts'],
    levels: ['Secondary', 'High School'],
    pedagogy: 'Standard',
    customPedagogy: '',
    wordCount: 5000,
    wordDistribution: 'balanced',
    wordEnforcement: 'flexible',
    
    // Language Config
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
    
    // Documents
    uploadedDocuments: [],
    needsDocumentUpload: false,
    
    // Metadata
    createdDate: new Date().toISOString(),
    lastModified: new Date().toISOString()
  });

  const updateConfigData = (data: Partial<ConfigData>) => {
    setConfigData({ ...configData, ...data });
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Changes saved",
      description: "Project configuration has been updated successfully."
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
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Project Configuration</CardTitle>
            <CardDescription>
              Edit your project settings and parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="system" className="space-y-6">
              <TabsList>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="project">Project</TabsTrigger>
                <TabsTrigger value="language">Language & Content</TabsTrigger>
              </TabsList>
              
              <TabsContent value="system" className="space-y-6">
                <SystemConfigStep 
                  data={configData} 
                  updateData={updateConfigData} 
                />
              </TabsContent>
              
              <TabsContent value="project" className="space-y-6">
                <ProjectConfigStep 
                  data={configData} 
                  updateData={updateConfigData}
                />
              </TabsContent>
              
              <TabsContent value="language" className="space-y-6">
                <LanguageConfigStep 
                  data={configData} 
                  updateData={updateConfigData}
                />
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 flex justify-end">
              <Button onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernLayout>
  );
};

export default ConfigurationWorkspace;
