
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
          variant={isDark ? "default" : "default"}
          className="text-white"
        >
          Continue
        </Button>
      ) : (
        <Button 
          onClick={onComplete} 
          variant={isDark ? "default" : "default"}
          className="text-white"
        >
          Create Project
        </Button>
      )}
    </div>
  );
}
