
import React, { useEffect } from 'react';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UnifiedProjectWizard } from '@/components/project-creation/UnifiedProjectWizard';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
            
            <ThemeCard className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">Create New Project</CardTitle>
                <CardDescription>
                  Configure your educational content project by following these steps
                </CardDescription>
              </CardHeader>
            </ThemeCard>
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
