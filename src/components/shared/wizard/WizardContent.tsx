
import React from 'react';
import { useWizard } from '@/contexts/WizardContext';

interface WizardContentProps {
  children: React.ReactNode;
}

export function WizardContent({ children }: WizardContentProps) {
  return (
    <div className="min-h-[300px]">
      {children}
    </div>
  );
}
