import React from 'react';
import { Wizard } from '@/components/shared/wizard/Wizard';
import { WizardStep } from '@/contexts/WizardContext';
import { ProjectBasicsStep } from './steps/ProjectBasicsStep';
import { QuickStartStep } from './steps/QuickStartStep';
import { SystemConfigStep } from './steps/enhanced/SystemConfigStep';
import { EnhancedProjectConfigStep } from './steps/enhanced/EnhancedProjectConfigStep'; 
import { EnhancedLanguageConfigStep } from './steps/enhanced/EnhancedLanguageConfigStep';
import { KnowledgeBaseStep } from './steps/KnowledgeBaseStep';
import { FinalReviewStep } from './steps/FinalReviewStep';
import { WizardNavigationManager } from './WizardNavigationManager';
import { useProjectCreation } from './hooks/useProjectCreation';
import { EnhancedProjectData } from './types/project-wizard-types';

interface EnhancedProjectWizardProps {
  onComplete: (projectId: string) => void;
}

export function EnhancedProjectWizard({ onComplete }: EnhancedProjectWizardProps) {
  const { isCreating, handleProjectCreate } = useProjectCreation({ onComplete });
  
  const steps: WizardStep[] = [
    { id: 0, name: 'Project Info' },
    { id: 1, name: 'Quick Start' },
    { 
      id: 2, 
      name: 'System Config',
      conditional: (data: EnhancedProjectData) => data.quickStart === 'custom'
    },
    { 
      id: 3, 
      name: 'Project Config',
      conditional: (data: EnhancedProjectData) => data.quickStart === 'custom'
    },
    { 
      id: 4, 
      name: 'Language Config',
      conditional: (data: EnhancedProjectData) => data.quickStart === 'custom'
    },
    { 
      id: 5, 
      name: 'Knowledge Base',
      conditional: (data: EnhancedProjectData) => data.hasKnowledgeBase === true
    },
    { id: 6, name: 'Summary' }
  ];
  
  const stepTitles: Record<number, string> = {
    0: "Basic Information",
    1: "Choose Your Path",
    2: "System Interaction Settings",
    3: "Project Configuration",
    4: "Language & Content Settings",
    5: "Knowledge Base Files",
    6: "Review & Create"
  };
  
  const stepDescriptions: Record<number, string> = {
    0: "Enter the basic details for your educational content project.",
    1: "Choose a template or start with custom configuration.",
    2: "Define how you want to interact with the system.",
    3: "Configure the core parameters for your educational content.",
    4: "Define language and content specifications.",
    5: "Upload reference materials and documents for your project.",
    6: "Review all settings before creating your project."
  };
  
  const stepHelp: Record<number, string> = {
    0: "Provide a clear, descriptive name and description for your project to make it easy to identify later.",
    1: "Templates provide pre-configured settings to speed up project creation. Choose 'Custom' for full control over all settings.",
    2: "These settings control how the system interacts with you. More proactive settings provide more suggestions, while more focused settings require more specific inputs.",
    3: "Define your educational content format, subject areas, target audience, and other key parameters that shape the structure of your content.",
    4: "Language settings define not just the target language but how language and cultural elements are presented within your content.",
    5: "Upload relevant documents to inform your project. These could include curriculum guides, existing textbooks, or reference materials.",
    6: "Review all settings before finalizing. You can go back to any step to make changes."
  };
  
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
    levels: ['Secondary'],
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
        return <EnhancedProjectConfigStep data={formData} updateData={updateData} />;
      case 4:
        return <EnhancedLanguageConfigStep data={formData} updateData={updateData} />;
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
      saveKey="enhanced-project-wizard"
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
      stepTitles={stepTitles}
      stepDescriptions={stepDescriptions}
      stepHelp={stepHelp}
    />
  );
}
