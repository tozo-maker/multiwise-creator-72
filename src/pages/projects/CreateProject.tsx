
import React from 'react';
import { ProjectCreationWizard } from '@/components/project-creation/ProjectCreationWizard';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { motion } from 'framer-motion';

export const CreateProject: React.FC = () => {
  return (
    <ModernLayout contentWidth="wide">
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
            <ProjectCreationWizard />
          </div>
        </div>
      </motion.div>
    </ModernLayout>
  );
};

export default CreateProject;
