
import React from 'react';
import { ProjectCreationWizard } from '@/components/project-creation/ProjectCreationWizard';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  
  return (
    <ModernLayout contentWidth="default">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
            <p className="text-muted-foreground">
              Set up your new educational content project.
            </p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <ProjectCreationWizard
              templateId="blank"
              onComplete={handleProjectCreated}
            />
          </div>
        </div>
      </motion.div>
    </ModernLayout>
  );
};

export default CreateProject;
