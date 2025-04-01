
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ConfigurationWizard } from '@/components/wizard/ConfigurationWizard';
import { ContextualHelp } from '@/components/help/ContextualHelp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const CreateProject = () => {
  return (
    <MainLayout contentWidth="wide">
      <div className="space-y-6">
        <div className="mb-6">
          <Alert variant="default" className="bg-brand-50 border-brand-200">
            <Info className="h-4 w-4 text-brand-500" />
            <AlertDescription>
              Your progress is automatically saved. You can leave and return to continue where you left off.
            </AlertDescription>
          </Alert>
        </div>
        <ConfigurationWizard />
        <ContextualHelp />
      </div>
    </MainLayout>
  );
};
