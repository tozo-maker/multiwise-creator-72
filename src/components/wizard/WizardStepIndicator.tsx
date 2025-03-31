
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardStepIndicatorProps {
  steps: string[];
  currentStep: number;
  hasVisited: (step: number) => boolean;
  onStepClick?: (step: number) => void;
}

export const WizardStepIndicator: React.FC<WizardStepIndicatorProps> = ({ 
  steps, 
  currentStep, 
  hasVisited,
  onStepClick 
}) => {
  return (
    <div className="w-full py-4 px-2 overflow-x-auto">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isComplete = hasVisited(index) && currentStep > index;
          const isClickable = hasVisited(index) && onStepClick;
          
          return (
            <div 
              key={`step-${index}`}
              className={cn(
                "step-item",
                isActive && "active",
                isComplete && "complete"
              )}
            >
              <button
                type="button"
                disabled={!isClickable}
                className={cn(
                  "step",
                  isActive && "active",
                  isComplete && "complete",
                  isClickable ? "cursor-pointer" : "cursor-default"
                )}
                onClick={() => isClickable && onStepClick && onStepClick(index)}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${index + 1}: ${step}`}
              >
                {isComplete ? (
                  <Check className="h-5 w-5 step-icon" />
                ) : (
                  index + 1
                )}
              </button>
              <div className="step-label">{step}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
