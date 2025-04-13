
import React from 'react';
import { WizardProvider, WizardStep } from '@/contexts/WizardContext';
import { WizardHeader } from './WizardHeader';
import { WizardSteps } from './WizardSteps';
import { WizardContent } from './WizardContent';
import { WizardNavigation } from './WizardNavigation';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { useTheme } from '@/contexts/ThemeContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

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
  stepTitles?: Record<number, string>;
  stepDescriptions?: Record<number, string>;
  stepHelp?: Record<number, string>;
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
  stepTitles,
  stepDescriptions,
  stepHelp
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
        const { currentStep, formData, updateFormData, stepProgress } = context;
        const currentStepHelp = stepHelp && stepHelp[currentStep];
        
        return (
          <div className={`space-y-6 w-full ${className}`}>
            {showStepIndicator && (
              <WizardSteps />
            )}
            
            <ThemeCard className={`shadow-sm ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              {(title || description || stepTitles || stepDescriptions) && (
                <WizardHeader 
                  title={title} 
                  description={description}
                  stepTitles={stepTitles}
                  stepDescriptions={stepDescriptions} 
                />
              )}
              
              {/* Progress indicator */}
              <div className="px-6 pt-2">
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300" 
                    style={{ width: `${stepProgress}%` }} 
                  />
                </div>
              </div>
              
              <div className="p-6 relative">
                {currentStepHelp && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          aria-label="Help"
                        >
                          <HelpCircle size={18} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        {currentStepHelp}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
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
