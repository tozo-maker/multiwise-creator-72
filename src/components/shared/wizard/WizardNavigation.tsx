
import React from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { ThemeButton } from '@/components/shared/ThemeButton';
import { useTheme } from '@/contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

interface WizardNavigationProps {
  onComplete: () => void;
  isSubmitting?: boolean;
}

export function WizardNavigation({ onComplete, isSubmitting = false }: WizardNavigationProps) {
  const { isFirstStep, isLastStep, nextStep, prevStep } = useWizard();
  const { isDark } = useTheme();

  return (
    <div className={`flex justify-between p-6 border-t ${
      isDark ? 'border-slate-700' : 'border-slate-200'
    }`}>
      <ThemeButton 
        variant="outline" 
        onClick={prevStep}
        disabled={isFirstStep || isSubmitting}
      >
        Back
      </ThemeButton>
      
      {!isLastStep ? (
        <ThemeButton 
          variant="primary"
          onClick={nextStep}
          disabled={isSubmitting}
        >
          Continue
        </ThemeButton>
      ) : (
        <ThemeButton 
          variant="primary"
          onClick={onComplete}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Project...
            </>
          ) : (
            "Create Project"
          )}
        </ThemeButton>
      )}
    </div>
  );
}
