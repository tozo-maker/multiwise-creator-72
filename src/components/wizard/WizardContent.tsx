
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { ProjectNameStep } from './steps/ProjectNameStep';
import { SystemConfigStep } from './steps/SystemConfigStep';
import { ProjectConfigStep } from './steps/ProjectConfigStep';
import { LanguageConfigStep } from './steps/LanguageConfigStep';
import { DocumentUploadStep } from './steps/DocumentUploadStep';
import { SummaryStep } from './steps/SummaryStep';
import { ConfigData } from './types';

interface WizardContentProps {
  currentStep: number;
  formData: ConfigData;
  updateFormData: (data: Partial<ConfigData>) => void;
}

export const WizardContent: React.FC<WizardContentProps> = ({
  currentStep,
  formData,
  updateFormData,
}) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ProjectNameStep data={formData} updateData={updateFormData} />;
      case 1:
        return <SystemConfigStep data={formData} updateData={updateFormData} />;
      case 2:
        return <ProjectConfigStep data={formData} updateData={updateFormData} />;
      case 3:
        return <LanguageConfigStep data={formData} updateData={updateFormData} />;
      case 4:
        return <DocumentUploadStep data={formData} updateData={updateFormData} />;
      case 5:
        return <SummaryStep data={formData} />;
      default:
        return null;
    }
  };

  return (
    <CardContent>
      {renderStepContent()}
    </CardContent>
  );
};
