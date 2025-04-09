
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  stepsCount: number;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  isSubmitting?: boolean;
}

export function WizardNavigation({ 
  currentStep, 
  stepsCount, 
  onNext, 
  onPrev, 
  onComplete,
  isSubmitting = false
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
        disabled={isFirstStep || isSubmitting}
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
          disabled={isSubmitting}
          className={isDark
            ? "bg-indigo-600 hover:bg-indigo-500 text-white"
            : "bg-indigo-600 hover:bg-indigo-500 text-white"
          }
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Project"
          )}
        </Button>
      )}
    </div>
  );
}
