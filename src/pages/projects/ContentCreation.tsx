
import React from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { ContentCreationForm } from '@/components/project/ContentCreationForm';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';

export const ContentCreation = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  // Mock project data
  const project = {
    id: projectId || '1',
    name: 'Spanish Language Textbook',
    type: 'Textbook',
    targetLanguage: 'Spanish'
  };
  
  const breadcrumbItems = [
    { label: 'Projects', path: '/projects' },
    { label: project.name, path: `/projects/${projectId}` },
    { label: 'Content', path: `/projects/${projectId}/content` },
    { label: 'Create Content' }
  ];
  
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
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="content" />
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Create Content</h2>
          <p className="text-slate-500">
            Generate new content with AI assistance using your project configuration and knowledge base.
          </p>
        </div>
        
        <ContentCreationForm />
      </div>
    </ModernLayout>
  );
};

export default ContentCreation;
