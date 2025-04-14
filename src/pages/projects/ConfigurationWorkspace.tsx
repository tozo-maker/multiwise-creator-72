
import React from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { ProjectBreadcrumbs } from '@/components/project/ProjectBreadcrumbs';
import { ConfigurationCard } from '@/components/configuration/ConfigurationCard';
import { ConfigurationLoading } from '@/components/configuration/ConfigurationLoading';
import { ConfigurationErrorAlert } from '@/components/configuration/ConfigurationErrorAlert';
import { useProjectConfiguration } from '@/hooks/useProjectConfiguration';

export const ConfigurationWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  const {
    isLoading,
    saveError,
    project,
    configData,
    updateConfigData,
    handleSaveChanges
  } = useProjectConfiguration({ projectId });
  
  if (isLoading) {
    return (
      <ModernLayout contentWidth="wide">
        <ConfigurationLoading />
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
        
        {saveError && <ConfigurationErrorAlert message={saveError} />}
        
        <ConfigurationCard 
          projectId={project.id}
          configData={configData}
          updateConfigData={updateConfigData}
          onSave={handleSaveChanges}
        />
      </div>
    </ModernLayout>
  );
};

export default ConfigurationWorkspace;
