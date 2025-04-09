
import React from 'react';
import { ProjectBasicsStep } from './steps/ProjectBasicsStep';
import { ProjectConfigStep } from './steps/ProjectConfigStep';
import { KnowledgeBaseStep } from './steps/KnowledgeBaseStep';
import { FinalReviewStep } from './steps/FinalReviewStep';
import { QuickStartStep } from './steps/QuickStartStep';
import { LanguageConfigStep } from './steps/LanguageConfigStep';
import { SystemConfigStep } from './steps/SystemConfigStep';
import { ProjectData } from './hooks/useProjectWizard';

interface WizardContentProps {
  currentStep: number;
  formData: ProjectData;
  updateData: (data: Partial<ProjectData>) => void;
}

export function WizardContent({ currentStep, formData, updateData }: WizardContentProps) {
  switch (currentStep) {
    case 0:
      return <ProjectBasicsStep data={formData} updateData={updateData} />;
    case 1:
      return <QuickStartStep data={formData} updateData={updateData} />;
    case 2:
      return <SystemConfigStep data={formData} updateData={updateData} />;
    case 3:
      return <ProjectConfigStep data={formData} updateData={updateData} />;
    case 4:
      return <LanguageConfigStep data={formData} updateData={updateData} />;
    case 5:
      return <KnowledgeBaseStep data={formData} updateData={updateData} />;
    case 6:
      return <FinalReviewStep data={formData} />;
    default:
      return null;
  }
}
