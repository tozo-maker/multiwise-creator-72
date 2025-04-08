
import React from 'react';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ProjectWizard } from '@/components/project-creation/ProjectWizard';
import { useTheme } from '@/contexts/ThemeContext';

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  
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
      <div className={`w-full min-h-screen -mt-4 py-6 ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className="w-full">
          <div>
            <PageBreadcrumbs items={breadcrumbItems} />
            
            <div className="mb-6">
              <h1 className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-slate-50' : 'text-slate-900'
              }`}>Create New Project</h1>
              <p className={
                theme === 'dark' ? 'text-slate-400 mt-1' : 'text-slate-600 mt-1'
              }>
                Configure your educational content project by following these steps.
              </p>
            </div>
          </div>
          
          <div>
            <ProjectWizard
              onComplete={handleProjectCreated}
            />
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}

export default CreateProject;
