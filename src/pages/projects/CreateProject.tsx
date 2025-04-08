
import React from 'react';
import { ProjectCreationWizard } from '@/components/project-creation/ProjectCreationWizard';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { Card } from '@/components/ui/card';

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
        className="space-y-6"
      >
        <div className="pt-4">
          <PageBreadcrumbs items={breadcrumbItems} />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Create New Project</h1>
          <p className="text-muted-foreground">
            Set up your new educational content project.
          </p>
        </div>
        
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
          <ProjectCreationWizard
            templateId="blank"
            onComplete={handleProjectCreated}
          />
        </Card>
      </motion.div>
    </ModernLayout>
  );
};

export default CreateProject;
