
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
import { useProjectCreation } from './hooks/useProjectCreation';
import { EnhancedProjectData } from './types/project-wizard-types';
import { useToast } from '@/hooks/use-toast';

interface EnhancedProjectWizardProps {
  onComplete: (projectId: string) => void;
}

export function EnhancedProjectWizard({ onComplete }: EnhancedProjectWizardProps) {
  const { isCreating, handleProjectCreate } = useProjectCreation({ onComplete });
  const { toast } = useToast();
  
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
    
    // Adding the missing properties to match ProjectData
    type: 'Textbook',      // Default to match projectType
    language: 'English',   // Default to match targetLanguage
    targetAudience: 'Secondary', // Default to match first item in levels
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
  
  // Create a handler that converts EnhancedProjectData to ProjectData
  const handleEnhancedProjectCreate = (data: EnhancedProjectData) => {
    // Make sure the required fields are synchronized
    const updatedData = {
      ...data,
      // Ensure these fields are synchronized with their enhanced equivalents
      type: data.projectType || data.type,
      language: data.targetLanguage || data.language,
      targetAudience: data.levels.length > 0 ? data.levels[0] : data.targetAudience
    };
    
    // Call the original handler with the updated data
    handleProjectCreate(updatedData);
  };

  // Custom navigation logic to handle conditional steps and validation
  const handleNavigateLogic = (currentStep: number, formData: EnhancedProjectData, goToStep: (step: number) => void) => {
    // Validate required fields
    if (currentStep === 0 && !formData.name) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project.",
        variant: "destructive"
      });
      return null;
    }
    
    // Handle template selection - skip system/project/language config if using template
    if (currentStep === 1 && formData.quickStart !== 'custom') {
      // Skip to Knowledge Base or Summary step
      const nextStep = formData.hasKnowledgeBase ? 5 : 6;
      return (
        <div className="hidden">
          <button onClick={() => goToStep(nextStep)}></button>
        </div>
      );
    }

    // Normal navigation
    return null;
  };
  
  return (
    <Wizard
      steps={steps}
      initialData={initialData}
      saveKey="enhanced-project-wizard"
      onComplete={handleEnhancedProjectCreate}
      renderStep={renderStep}
      navigateLogic={handleNavigateLogic}
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
