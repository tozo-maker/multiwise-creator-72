
import React from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { ThemeButton } from '@/components/shared/ThemeButton';
import { useTheme } from '@/contexts/ThemeContext';

interface WizardNavigationProps {
  onComplete: () => void;
}

export function WizardNavigation({ onComplete }: WizardNavigationProps) {
  const { isFirstStep, isLastStep, nextStep, prevStep } = useWizard();
  const { isDark } = useTheme();

  return (
    <div className={`flex justify-between p-6 border-t ${
      isDark ? 'border-slate-700' : 'border-slate-200'
    }`}>
      <ThemeButton 
        variant="outline" 
        onClick={prevStep}
        disabled={isFirstStep}
      >
        Back
      </ThemeButton>
      
      {!isLastStep ? (
        <ThemeButton 
          variant="primary"
          onClick={nextStep}
        >
          Continue
        </ThemeButton>
      ) : (
        <ThemeButton 
          variant="primary"
          onClick={onComplete}
        >
          Create Project
        </ThemeButton>
      )}
    </div>
  );
}
