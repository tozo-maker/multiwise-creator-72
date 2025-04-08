
import React from 'react';
import { ProjectCreationWizard } from '@/components/project-creation/ProjectCreationWizard';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { Card, CardContent } from '@/components/ui/card';

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
    { label: 'Projects', path: '/projects' },
    { label: 'Create New Project' }
  ];
  
  return (
    <ModernLayout contentWidth="wide">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 w-full"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <PageBreadcrumbs items={breadcrumbItems} />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Create New Project</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Set up your new educational content project.
            </p>
          </div>
          
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950 w-full">
            <CardContent className="p-6">
              <ProjectCreationWizard
                templateId="blank"
                onComplete={handleProjectCreated}
              />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </ModernLayout>
  );
}

export default CreateProject;
