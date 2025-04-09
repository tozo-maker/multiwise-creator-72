
import React from 'react';
import { Card } from '@/components/ui/card';
import { WizardSteps } from './WizardSteps';
import { WizardContent } from './WizardContent';
import { WizardNavigation } from './WizardNavigation';
import { useProjectWizard, WizardStep } from './hooks/useProjectWizard';
import { useTheme } from '@/contexts/ThemeContext';

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
  
  const { isDark } = useTheme();
  
  return (
    <div className="w-full space-y-6">
      <WizardSteps 
        steps={steps}
        currentStep={currentStep}
        hasVisited={(stepId: number) => hasVisited.includes(stepId)}
        onStepClick={goToStep}
      />
      
      <Card className={`w-full ${
        isDark 
          ? "border-slate-700 bg-slate-800/50 shadow-lg" 
          : "border-slate-200 bg-white shadow-sm"
      }`}>
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
