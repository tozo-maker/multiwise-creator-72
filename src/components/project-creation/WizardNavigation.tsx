
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface WizardNavigationProps {
  currentStep: number;
  stepsCount: number;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

export function WizardNavigation({ 
  currentStep, 
  stepsCount, 
  onNext, 
  onPrev, 
  onComplete 
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === stepsCount - 1;
  const { isDark } = useTheme();

  return (
    <div className={`flex justify-between p-6 border-t ${
      isDark ? 'border-slate-700' : 'border-slate-200'
    }`}>
      <Button 
        variant="outline" 
        onClick={onPrev}
        disabled={isFirstStep}
        className={isDark 
          ? "border-slate-600 text-slate-300 hover:bg-slate-700" 
          : "border-slate-200 text-slate-700 hover:bg-slate-50"
        }
      >
        Back
      </Button>
      
      {!isLastStep ? (
        <Button 
          onClick={onNext}
          className={isDark
            ? "bg-indigo-600 hover:bg-indigo-500 text-white"
            : "bg-indigo-600 hover:bg-indigo-500 text-white"
          }
        >
          Continue
        </Button>
      ) : (
        <Button 
          onClick={onComplete}
          className={isDark
            ? "bg-indigo-600 hover:bg-indigo-500 text-white"
            : "bg-indigo-600 hover:bg-indigo-500 text-white"
          }
        >
          Create Project
        </Button>
      )}
    </div>
  );
}
