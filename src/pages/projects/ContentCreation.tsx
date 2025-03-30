
import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { ContentCreationForm } from '@/components/project/ContentCreationForm';

export const ContentCreation = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  // Mock project data
  const project = {
    id: projectId || '1',
    name: 'Spanish Language Textbook',
    type: 'Textbook',
    targetLanguage: 'Spanish'
  };
  
  return (
    <MainLayout>
      <ProjectWorkspaceHeader 
        projectName={project.name}
        projectType={project.type}
        targetLanguage={project.targetLanguage}
      />
      
      <ProjectWorkspaceTabs projectId={project.id} />
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Create Content</h2>
        <p className="text-slate-500">
          Generate new content with AI assistance using your project configuration and knowledge base.
        </p>
      </div>
      
      <ContentCreationForm />
    </MainLayout>
  );
};
