
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ConfigurationWizard } from '@/components/wizard/ConfigurationWizard';

export const CreateProject = () => {
  return (
    <MainLayout>
      <ConfigurationWizard />
    </MainLayout>
  );
};
