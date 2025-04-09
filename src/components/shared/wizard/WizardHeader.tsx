
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useWizard } from '@/contexts/WizardContext';
import { useTheme } from '@/contexts/ThemeContext';

interface WizardHeaderProps {
  title?: string;
  description?: string;
  stepTitles?: Record<number, string>;
  stepDescriptions?: Record<number, string>;
}

export function WizardHeader({ 
  title, 
  description,
  stepTitles,
  stepDescriptions 
}: WizardHeaderProps) {
  const { currentStep } = useWizard();
  const { isDark } = useTheme();
  
  const stepTitle = stepTitles?.[currentStep];
  const stepDescription = stepDescriptions?.[currentStep];
  
  const displayTitle = stepTitle || title;
  const displayDescription = stepDescription || description;

  return (
    <CardHeader className={`${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
      {displayTitle && (
        <CardTitle className={`${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          {displayTitle}
        </CardTitle>
      )}
      {displayDescription && (
        <CardDescription className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {displayDescription}
        </CardDescription>
      )}
    </CardHeader>
  );
}
