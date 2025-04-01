
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: number;
  name: string;
  hidden?: boolean;
}

export interface WizardStepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
  hasVisited?: (step: number) => boolean;
  onStepClick?: (step: number) => void;
  className?: string;
}

export const WizardStepIndicator: React.FC<WizardStepIndicatorProps> = ({ 
  steps, 
  currentStep, 
  hasVisited = () => false,
  onStepClick,
  className
}) => {
  // Ensure steps is an array before filtering
  const validSteps = Array.isArray(steps) ? steps.filter(step => !step?.hidden) : [];
  
  return (
    <div className={cn("w-full py-4 px-2 overflow-x-auto", className)}>
      <div className="flex items-center justify-between">
        {validSteps.map((step) => {
          const isActive = currentStep === step.id;
          const isComplete = hasVisited(step.id) && currentStep > step.id;
          const isClickable = hasVisited(step.id) && onStepClick;
          
          return (
            <div 
              key={`step-${step.id}`}
              className={cn(
                "flex flex-col items-center",
                isActive && "active",
                isComplete && "complete"
              )}
            >
              <button
                type="button"
                disabled={!isClickable}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-sm font-medium text-slate-700",
                  isActive && "border-brand-500 text-brand-500",
                  isComplete && "border-brand-500 bg-brand-500 text-white",
                  isClickable ? "cursor-pointer hover:bg-slate-50" : "cursor-default"
                )}
                onClick={() => isClickable && onStepClick && onStepClick(step.id)}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${step.id + 1}: ${step.name}`}
              >
                {isComplete ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id + 1
                )}
              </button>
              <div className="mt-2 text-xs text-slate-600">{step.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
