
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';

interface WizardStep {
  id: number;
  name: string;
}

interface WizardStepsProps {
  steps: WizardStep[];
  currentStep: number;
  hasVisited: (stepId: number) => boolean;
  onStepClick: (stepId: number) => void;
}

export function WizardSteps({ 
  steps, 
  currentStep, 
  hasVisited,
  onStepClick
}: WizardStepsProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isComplete = hasVisited(step.id) && !isActive;
          const isClickable = hasVisited(step.id);
          
          return (
            <div key={step.id} className="flex flex-col items-center relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "absolute top-4 h-1 w-full left-1/2 -z-10",
                    (hasVisited(steps[index + 1].id) || currentStep === steps[index + 1].id) 
                      ? "bg-indigo-500" 
                      : "bg-slate-700"
                  )}
                />
              )}
              
              {/* Step circle */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.id)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2",
                  isActive && "bg-indigo-600 text-white border-indigo-600",
                  isComplete && "bg-indigo-600 text-white border-indigo-600",
                  !isActive && !isComplete && "bg-slate-800 text-slate-400 border-slate-700",
                  isClickable && !isActive && "hover:border-indigo-400 cursor-pointer"
                )}
              >
                {isComplete ? <CheckIcon className="h-4 w-4" /> : index + 1}
              </button>
              
              {/* Step name */}
              <span 
                className={cn(
                  "mt-2 text-xs font-medium hidden md:block",
                  isActive && "text-indigo-400",
                  isComplete && "text-slate-300",
                  !isActive && !isComplete && "text-slate-500"
                )}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
