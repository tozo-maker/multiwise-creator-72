
import React from 'react';
import { Card } from '@/components/ui/card';
import { WizardSteps } from './WizardSteps';
import { WizardContent } from './WizardContent';
import { WizardNavigation } from './WizardNavigation';
import { useProjectWizard } from './hooks/useProjectWizard';

interface ProjectWizardProps {
  onComplete: (projectId: string) => void;
}

export function ProjectWizard({ onComplete }: ProjectWizardProps) {
  const {
    currentStep,
    steps,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    hasVisited,
    handleCreate
  } = useProjectWizard(onComplete);
  
  return (
    <div className="space-y-6 w-full">
      <WizardSteps 
        steps={steps}
        currentStep={currentStep}
        hasVisited={hasVisited}
        onStepClick={goToStep}
      />
      
      <Card className="w-full border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
        <div className="p-6">
          <WizardContent 
            currentStep={currentStep} 
            formData={formData} 
            updateData={updateFormData} 
          />
        </div>
        
        <WizardNavigation 
          currentStep={currentStep}
          stepsCount={steps.length}
          onNext={nextStep}
          onPrev={prevStep}
          onComplete={handleCreate}
        />
      </Card>
    </div>
  );
}
