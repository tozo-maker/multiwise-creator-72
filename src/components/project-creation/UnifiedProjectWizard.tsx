
import React from 'react';
import { Wizard } from '@/components/shared/wizard/Wizard';
import { WizardStep } from '@/contexts/WizardContext';
import { ProjectBasicsStep } from './steps/ProjectBasicsStep';
import { QuickStartStep } from './steps/QuickStartStep';
import { SystemConfigStep } from './steps/SystemConfigStep';
import { ProjectConfigStep } from './steps/ProjectConfigStep';
import { LanguageConfigStep } from './steps/LanguageConfigStep';
import { KnowledgeBaseStep } from './steps/KnowledgeBaseStep';
import { FinalReviewStep } from './steps/FinalReviewStep';
import { ProjectData } from './hooks/useProjectWizard';
import { WizardNavigationManager } from './WizardNavigationManager';
import { useProjectCreation } from './hooks/useProjectCreation';

interface UnifiedProjectWizardProps {
  onComplete: (projectId: string) => void;
}

export function UnifiedProjectWizard({ onComplete }: UnifiedProjectWizardProps) {
  const { isCreating, handleProjectCreate } = useProjectCreation({ onComplete });
  
  const steps: WizardStep[] = [
    { id: 0, name: 'Project Info' },
    { id: 1, name: 'Quick Start' },
    { id: 2, name: 'System Config' },
    { id: 3, name: 'Project Config' },
    { id: 4, name: 'Language Config' },
    { id: 5, name: 'Documents' },
    { id: 6, name: 'Summary' }
  ];
  
  const initialData: ProjectData = {
    name: '',
    description: '',
    type: 'Textbook',
    language: 'English',
    targetAudience: 'Students',
    complexity: 'Intermediate',
    quickStart: 'custom',
    templateId: 'custom',
    hasKnowledgeBase: false,
    knowledgeBaseFiles: [],
    deadline: '',
  };
  
  const renderStep = (stepId: number, formData: ProjectData, updateData: (data: Partial<ProjectData>) => void) => {
    switch (stepId) {
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
  };
  
  return (
    <Wizard
      steps={steps}
      initialData={initialData}
      saveKey="project-wizard"
      onComplete={handleProjectCreate}
      renderStep={renderStep}
      navigateLogic={(currentStep, formData, goToStep) => (
        <WizardNavigationManager 
          currentStep={currentStep}
          formData={formData}
          goToStep={goToStep}
        >
          {(navigateToNext) => {
            return <span onClick={navigateToNext} style={{ display: 'none' }}></span>;
          }}
        </WizardNavigationManager>
      )}
      showStepIndicator={true}
      title="Create New Project"
      description="Configure your educational content project by following these steps."
      className="w-full"
      isSubmitting={isCreating}
    />
  );
}
