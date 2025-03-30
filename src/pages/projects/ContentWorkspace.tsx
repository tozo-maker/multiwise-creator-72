
import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { ContentCreationForm } from '@/components/project/ContentCreationForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const ContentWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  // Mock project data - would normally be fetched based on ID
  const project = {
    id: projectId || '1',
    name: 'Spanish Language Textbook',
    type: 'Textbook',
    targetLanguage: 'Spanish',
    lastModified: '2 hours ago',
    progress: 65
  };
  
  return (
    <MainLayout>
      <ProjectWorkspaceHeader 
        projectName={project.name}
        projectType={project.type}
        targetLanguage={project.targetLanguage}
      />
      
      <ProjectWorkspaceTabs projectId={project.id} activeTab="content" />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Create New Chapter or Section</CardTitle>
          <CardDescription>
            Configure the content you want to generate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentCreationForm />
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default ContentWorkspace;
