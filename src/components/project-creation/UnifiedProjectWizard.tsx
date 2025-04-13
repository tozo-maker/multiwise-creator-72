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
import { EnhancedProjectData } from './types/project-wizard-types';

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
  
  // Create an enhanced initial data object that contains all required properties
  const initialData: EnhancedProjectData = {
    // Basic information
    name: '',
    description: '',
    
    // Quick Start
    quickStart: 'custom',
    templateId: 'custom',
    
    // System Configuration
    interfaceLanguage: 'English',
    experienceLevel: 'Intermediate',
    interactionMode: 'Guided',
    outputDetail: 'Balanced',
    systemBehavior: 'Collaborative',
    
    // Project Configuration
    projectType: 'Textbook',
    customProjectType: '',
    subjects: [],
    levels: ['Students'],
    pedagogy: 'Standard',
    customPedagogy: '',
    wordCount: 5000,
    wordDistribution: 'balanced',
    wordEnforcement: 'flexible',
    
    // Language Configuration
    targetLanguage: 'English',
    goal: 'Teaching',
    complexity: 'Intermediate',
    culturalIntegration: 'Standard',
    terminology: 'Standard',
    markers: 'Headings',
    standards: [],
    customStandards: [],
    structure: 'Traditional',
    formatting: 'Standard',
    scriptType: 'Latin',
    
    // Knowledge Base
    hasKnowledgeBase: false,
    knowledgeBaseFiles: [],
    
    // Other settings
    deadline: '',
    
    // Adding the missing properties to match ProjectData
    type: 'Textbook',
    language: 'English',
    targetAudience: 'Students',
  };
  
  // Create a handler that converts EnhancedProjectData to ProjectData
  const handleEnhancedProjectCreate = (data: EnhancedProjectData) => {
    // Create the ProjectData object with required properties
    const projectData: ProjectData = {
      name: data.name,
      description: data.description,
      type: data.projectType,
      language: data.targetLanguage,
      targetAudience: data.levels[0] || 'Students',
      complexity: data.complexity,
      quickStart: data.quickStart,
      templateId: data.templateId,
      hasKnowledgeBase: data.hasKnowledgeBase,
      knowledgeBaseFiles: data.knowledgeBaseFiles,
      deadline: data.deadline,
    };
    
    // Call the original handler with the converted data
    handleProjectCreate(projectData);
  };
  
  const renderStep = (stepId: number, formData: EnhancedProjectData, updateData: (data: Partial<EnhancedProjectData>) => void) => {
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
      onComplete={handleEnhancedProjectCreate}
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
