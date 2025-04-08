
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
      <div className="w-full bg-slate-900/90 dark:bg-slate-900/90 min-h-screen -mt-4 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <PageBreadcrumbs items={breadcrumbItems} />
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-50">Create New Project</h1>
            <p className="text-slate-400 mt-1">
              Configure your educational content project by following these steps.
            </p>
          </div>
          
          <ProjectWizard
            onComplete={handleProjectCreated}
          />
        </div>
      </div>
    </ModernLayout>
  );
}

export default CreateProject;
