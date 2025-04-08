
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useWizard } from '@/contexts/WizardContext';

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
  
  const stepTitle = stepTitles?.[currentStep];
  const stepDescription = stepDescriptions?.[currentStep];
  
  const displayTitle = stepTitle || title;
  const displayDescription = stepDescription || description;

  return (
    <CardHeader>
      {displayTitle && (
        <CardTitle>{displayTitle}</CardTitle>
      )}
      {displayDescription && (
        <CardDescription>{displayDescription}</CardDescription>
      )}
    </CardHeader>
  );
}
