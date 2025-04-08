
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: number;
  name: string;
  hidden?: boolean;
}

export interface WizardStepsProps {
  steps: WizardStep[];
  currentStep: number;
  hasVisited?: (step: number) => boolean;
  onStepClick?: (step: number) => void;
}

export function WizardSteps({ 
  steps, 
  currentStep, 
  hasVisited = () => false,
  onStepClick
}: WizardStepsProps) {
  // Filter out hidden steps
  const visibleSteps = steps.filter(step => !step.hidden);
  
  return (
    <div className="relative mb-8">
      <div className="flex items-center justify-between w-full">
        {visibleSteps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isComplete = hasVisited(step.id) && currentStep > step.id;
          const isClickable = hasVisited(step.id) && onStepClick;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="flex flex-col items-center relative">
                <button
                  type="button"
                  disabled={!isClickable}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium z-10",
                    isActive 
                      ? "border-indigo-600 bg-indigo-600 text-white" 
                      : isComplete 
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300",
                    isClickable ? "cursor-pointer hover:border-indigo-500" : "cursor-default"
                  )}
                  onClick={() => isClickable && onStepClick && onStepClick(step.id)}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id + 1
                  )}
                </button>
                <span className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                  {step.name}
                </span>
              </div>
              
              {/* Connector line - don't add after the last item */}
              {index < visibleSteps.length - 1 && (
                <div 
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    currentStep > step.id 
                      ? "bg-indigo-600" 
                      : "bg-slate-200 dark:bg-slate-700"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
