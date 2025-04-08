
import React from 'react';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ProjectWizard } from '@/components/project-creation/ProjectWizard';

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleProjectCreated = (projectId: string) => {
    toast({
      title: "Project created successfully",
      description: "Your new project has been created."
    });
    navigate(`/projects/${projectId}`);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: 'Create New Project' }
  ];
  
  return (
    <ModernLayout contentWidth="wide">
      <div className="w-full">
        <PageBreadcrumbs items={breadcrumbItems} />
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Create New Project</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Configure your educational content project by following these steps.
          </p>
        </div>
        
        <ProjectWizard
          onComplete={handleProjectCreated}
        />
      </div>
    </ModernLayout>
  );
}

export default CreateProject;
