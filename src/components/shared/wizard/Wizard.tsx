
import React from 'react';
import { WizardProvider, WizardStep } from '@/contexts/WizardContext';
import { WizardHeader } from './WizardHeader';
import { WizardSteps } from './WizardSteps';
import { WizardContent } from './WizardContent';
import { WizardNavigation } from './WizardNavigation';
import { ThemeCard } from '@/components/shared/ThemeCard';

interface WizardProps<T extends Record<string, any>> {
  title?: string;
  description?: string;
  steps: WizardStep[];
  initialData: T;
  saveKey?: string;
  onComplete: (data: T) => void;
  renderStep: (stepId: number, data: T, updateData: (data: Partial<T>) => void) => React.ReactNode;
  navigateLogic?: (currentStep: number, formData: T, goToStep: (step: number) => void) => void;
  className?: string;
  showStepIndicator?: boolean;
}

export function Wizard<T extends Record<string, any>>({
  title,
  description,
  steps,
  initialData,
  saveKey,
  onComplete,
  renderStep,
  navigateLogic,
  className = '',
  showStepIndicator = true,
}: WizardProps<T>) {
  return (
    <WizardProvider 
      steps={steps}
      initialData={initialData}
      saveKey={saveKey}
      navigateLogic={navigateLogic}
    >
      {(context: any) => {
        const { currentStep, formData, updateFormData, hasVisited, goToStep } = context;
        
        return (
          <div className={`space-y-6 w-full ${className}`}>
            {showStepIndicator && (
              <WizardSteps />
            )}
            
            <ThemeCard>
              {(title || description) && (
                <WizardHeader title={title} description={description} />
              )}
              
              <div className="p-6">
                <WizardContent>
                  {renderStep(currentStep, formData, updateFormData)}
                </WizardContent>
              </div>
              
              <WizardNavigation 
                onComplete={() => onComplete(formData)}
              />
            </ThemeCard>
          </div>
        );
      }}
    </WizardProvider>
  );
}
