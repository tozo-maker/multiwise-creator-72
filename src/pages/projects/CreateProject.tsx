
import React, { useEffect } from 'react';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UnifiedProjectWizard } from '@/components/project-creation/UnifiedProjectWizard';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isDark } = useTheme();
  const { user } = useAuth();
  
  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a project",
        variant: "destructive"
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);
  
  const handleProjectCreated = (projectId: string) => {
    toast({
      title: "Project created successfully",
      description: "Your new project has been created."
    });
    // Navigate to the project page with the new project ID
    navigate(`/projects/${projectId}`);
  };

  const breadcrumbItems = [
    { label: 'Projects', path: '/projects' },
    { label: 'Create New Project' }
  ];
  
  if (!user) {
    return null; // Don't render anything if not authenticated
  }
  
  return (
    <ModernLayout contentWidth="wide">
      <div className={`w-full min-h-screen -mt-4 py-6 ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-6">
            <PageBreadcrumbs items={breadcrumbItems} />
            
            <div className="mb-6">
              <h1 className={`text-3xl font-bold ${
                isDark ? 'text-slate-50' : 'text-slate-900'
              }`}>Create New Project</h1>
              <p className={
                isDark ? 'text-slate-400 mt-1' : 'text-slate-600 mt-1'
              }>
                Configure your educational content project by following these steps.
              </p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <UnifiedProjectWizard
              onComplete={handleProjectCreated}
            />
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default CreateProject;
