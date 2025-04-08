
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDark } = useTheme();
  
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
                      ? isDark ? "bg-indigo-500" : "bg-indigo-600" 
                      : isDark ? "bg-slate-700" : "bg-slate-200"
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
                  isActive && isDark && "bg-indigo-600 text-white border-indigo-600",
                  isActive && !isDark && "bg-indigo-600 text-white border-indigo-600",
                  isComplete && isDark && "bg-indigo-600 text-white border-indigo-600",
                  isComplete && !isDark && "bg-indigo-600 text-white border-indigo-600",
                  !isActive && !isComplete && isDark && "bg-slate-800 text-slate-400 border-slate-700",
                  !isActive && !isComplete && !isDark && "bg-white text-slate-500 border-slate-300",
                  isClickable && !isActive && isDark && "hover:border-indigo-400 cursor-pointer",
                  isClickable && !isActive && !isDark && "hover:border-indigo-400 cursor-pointer"
                )}
              >
                {isComplete ? <CheckIcon className="h-4 w-4" /> : index + 1}
              </button>
              
              {/* Step name */}
              <span 
                className={cn(
                  "mt-2 text-xs font-medium hidden md:block",
                  isActive && isDark && "text-indigo-400",
                  isActive && !isDark && "text-indigo-600",
                  isComplete && isDark && "text-slate-300",
                  isComplete && !isDark && "text-slate-600",
                  !isActive && !isComplete && isDark && "text-slate-500",
                  !isActive && !isComplete && !isDark && "text-slate-400"
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
