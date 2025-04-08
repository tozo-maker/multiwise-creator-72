
import React from 'react';
import { Button } from '@/components/ui/button';

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

  return (
    <div className="flex justify-between p-6 border-t border-slate-700">
      <Button 
        variant="outline" 
        onClick={onPrev}
        disabled={isFirstStep}
        className="border-slate-600 dark:border-slate-600 text-slate-300 hover:bg-slate-700"
      >
        Back
      </Button>
      
      {!isLastStep ? (
        <Button 
          onClick={onNext} 
          className="bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Continue
        </Button>
      ) : (
        <Button 
          onClick={onComplete} 
          className="bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Create Project
        </Button>
      )}
    </div>
  );
}
