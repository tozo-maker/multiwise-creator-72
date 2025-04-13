
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWizard, WizardStep } from '@/contexts/WizardContext';
import { useTheme } from '@/contexts/ThemeContext';

interface WizardStepsProps {
  className?: string;
}

export function WizardSteps({ className }: WizardStepsProps = {}) {
  const { currentStep, steps, hasVisited, goToStep } = useWizard();
  const { isDark } = useTheme();
  
  // Filter out hidden steps
  const validSteps = Array.isArray(steps) ? steps.filter(step => !step?.hidden) : [];
  
  return (
    <div className={cn("w-full mb-8", className)}>
      <div className="flex justify-between items-center">
        {validSteps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isComplete = hasVisited(step.id) && currentStep > step.id;
          const isClickable = hasVisited(step.id);
          
          return (
            <React.Fragment key={`step-${step.id}`}>
              {/* Step */}
              <div className="flex flex-col items-center relative">
                {/* Connector line */}
                {index < validSteps.length - 1 && (
                  <div 
                    className={cn(
                      "absolute top-4 h-1 w-[200%] left-1/2 -z-10",
                      (hasVisited(validSteps[index + 1].id) || currentStep === validSteps[index + 1].id) 
                        ? isDark ? "bg-indigo-500" : "bg-indigo-600" 
                        : isDark ? "bg-slate-700" : "bg-slate-200"
                    )}
                  />
                )}
                
                {/* Step circle */}
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && goToStep(step.id)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-200",
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
                  {isComplete ? <Check className="h-4 w-4" /> : index + 1}
                </button>
                
                {/* Step name */}
                <span 
                  className={cn(
                    "mt-2 text-xs font-medium transition-colors duration-200",
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
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
