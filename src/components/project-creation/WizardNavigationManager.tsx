
import React from 'react';
import { ProjectData } from './hooks/useProjectWizard';
import { useToast } from '@/hooks/use-toast';

interface WizardNavigationManagerProps {
  currentStep: number;
  formData: ProjectData;
  goToStep: (step: number) => void;
  children: (navigateToNext: () => void) => React.ReactNode;
}

export const WizardNavigationManager: React.FC<WizardNavigationManagerProps> = ({
  currentStep,
  formData,
  goToStep,
  children
}) => {
  const { toast } = useToast();
  
  const navigateLogic = () => {
    if (currentStep === 0 && !formData.name) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 1 && formData.quickStart !== 'custom' && formData.quickStart !== '') {
      goToStep(5);
      return;
    }
    
    goToStep(currentStep + 1);
  };
  
  return <>{children(navigateLogic)}</>;
};
