
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
    <div className="w-full space-y-6">
      <WizardSteps 
        steps={steps}
        currentStep={currentStep}
        hasVisited={hasVisited}
        onStepClick={goToStep}
      />
      
      <Card className="w-full border-slate-700 bg-slate-800/50 dark:bg-slate-800/50 shadow-lg">
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
