
import React from 'react';
import { WizardProvider, WizardStep } from '@/contexts/WizardContext';
import { WizardHeader } from './WizardHeader';
import { WizardSteps } from './WizardSteps';
import { WizardContent } from './WizardContent';
import { WizardNavigation } from './WizardNavigation';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { useTheme } from '@/contexts/ThemeContext';

interface WizardProps<T extends Record<string, any>> {
  title?: string;
  description?: string;
  steps: WizardStep[];
  initialData: T;
  saveKey?: string;
  onComplete: (data: T) => void;
  renderStep: (stepId: number, data: T, updateData: (data: Partial<T>) => void) => React.ReactNode;
  navigateLogic?: (currentStep: number, formData: T, goToStep: (step: number) => void) => React.ReactNode;
  className?: string;
  showStepIndicator?: boolean;
  isSubmitting?: boolean;
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
  isSubmitting = false,
}: WizardProps<T>) {
  const { isDark } = useTheme();
  
  return (
    <WizardProvider 
      steps={steps}
      initialData={initialData}
      saveKey={saveKey}
      navigateLogic={navigateLogic}
    >
      {(context) => {
        const { currentStep, formData, updateFormData } = context;
        
        return (
          <div className={`space-y-6 w-full ${className}`}>
            {showStepIndicator && (
              <WizardSteps />
            )}
            
            <ThemeCard className={`shadow-sm ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
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
                isSubmitting={isSubmitting}
              />
            </ThemeCard>
          </div>
        );
      }}
    </WizardProvider>
  );
}
