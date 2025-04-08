
import React from 'react';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';

interface KnowledgeBaseHeaderProps {
  projectId: string;
  project: {
    id: string;
    name: string;
    type: string;
    targetLanguage: string;
  };
}

export const KnowledgeBaseHeader: React.FC<KnowledgeBaseHeaderProps> = ({
  projectId,
  project
}) => {
  const breadcrumbItems = [
    {
      label: 'Projects',
      path: '/projects'
    }, 
    {
      label: project.name,
      path: `/projects/${project.id}`
    }, 
    {
      label: 'Knowledge Base'
    }
  ];

  return (
    <>
      <div className="pt-4">
        <PageBreadcrumbs items={breadcrumbItems} />
      </div>
      
      <ProjectWorkspaceHeader 
        projectName={project.name} 
        projectType={project.type} 
        targetLanguage={project.targetLanguage} 
      />
      
      <ProjectWorkspaceTabs projectId={project.id} activeTab="knowledge-base" />
    </>
  );
};
