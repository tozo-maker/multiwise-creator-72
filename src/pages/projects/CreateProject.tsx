
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ConfigurationWizard } from '@/components/wizard/ConfigurationWizard';
import { ContextualHelp } from '@/components/help/ContextualHelp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoCircle } from 'lucide-react';

export const CreateProject = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <Alert variant="default" className="bg-brand-50 border-brand-200">
          <InfoCircle className="h-4 w-4 text-brand-500" />
          <AlertDescription>
            Your progress is automatically saved. You can leave and return to continue where you left off.
          </AlertDescription>
        </Alert>
      </div>
      <ConfigurationWizard />
      <ContextualHelp />
    </MainLayout>
  );
};
