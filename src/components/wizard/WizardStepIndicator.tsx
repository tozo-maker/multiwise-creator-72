
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: number;
  name: string;
  hidden?: boolean;
}

interface WizardStepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  className?: string;
}

export const WizardStepIndicator: React.FC<WizardStepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
  className
}) => {
  const visibleSteps = steps.filter(step => !step.hidden);
  
  return (
    <div className={cn("flex justify-center", className)}>
      <nav aria-label="Progress" className="flex">
        {visibleSteps.map((step, index) => {
          const isComplete = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = onStepClick && isComplete;
          
          return (
            <React.Fragment key={step.id}>
              <div 
                className={cn(
                  "step-item flex items-center",
                  { "cursor-pointer": isClickable }
                )}
                onClick={() => isClickable && onStepClick(step.id)}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                    {
                      "border-brand-500 bg-brand-500 text-white": isComplete || isCurrent,
                      "border-slate-300 text-slate-500": !isComplete && !isCurrent
                    }
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`Step ${index + 1}: ${step.name}`}
                  role="button"
                  tabIndex={isClickable ? 0 : -1}
                  onKeyDown={(e) => {
                    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onStepClick(step.id);
                    }
                  }}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="ml-2 hidden sm:block">
                  <p 
                    className={cn(
                      "text-sm font-medium",
                      {
                        "text-brand-600": isCurrent,
                        "text-slate-900": isComplete,
                        "text-slate-500": !isComplete && !isCurrent
                      }
                    )}
                  >
                    {step.name}
                  </p>
                </div>
              </div>
              
              {index < visibleSteps.length - 1 && (
                <div 
                  className="flex-auto mx-2 sm:mx-4 h-0.5 self-center"
                  aria-hidden="true"
                >
                  <div 
                    className={cn(
                      "h-full",
                      isComplete && index < currentStep 
                        ? "bg-brand-500" 
                        : "bg-slate-200"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};
