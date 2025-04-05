
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WizardFooterProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export const WizardFooter: React.FC<WizardFooterProps> = ({
  isFirstStep,
  isLastStep,
  onPrev,
  onNext,
  onComplete,
}) => {
  return (
    <CardFooter className="flex justify-between border-t border-slate-200 pt-4">
      <Button 
        variant="outline" 
        onClick={onPrev} 
        disabled={isFirstStep}
      >
        Back
      </Button>
      
      <div>
        {!isLastStep ? (
          <Button 
            className="bg-brand-500 hover:bg-brand-600 text-white"
            onClick={onNext}
          >
            Continue
          </Button>
        ) : (
          <Button 
            className="bg-brand-500 hover:bg-brand-600 text-white"
            onClick={onComplete}
          >
            Create Project
          </Button>
        )}
      </div>
    </CardFooter>
  );
};
