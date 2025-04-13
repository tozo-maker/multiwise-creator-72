
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useWizardForm } from '@/hooks/useWizardForm';
import { ConfigData } from './types';
import { WizardStepIndicator } from './WizardStepIndicator';
import { ConfigurationWizardHeader } from './ConfigurationWizardHeader';
import { WizardContent } from './WizardContent';
import { WizardFooter } from './WizardFooter';
import { WIZARD_STEPS } from './wizardSteps';
import { ModernLayout } from '@/components/layout/ModernLayout';

export const ConfigurationWizardContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    hasVisited
  } = useWizardForm<ConfigData>({
    initialData: {
      name: '',
      quickStart: 'custom',
      interfaceLanguage: 'English',
      experienceLevel: 'Intermediate',
      interactionMode: 'Conversational',
      outputDetail: 'Balanced',
      systemBehavior: 'Collaborative',
      projectType: 'Textbook',
      customProjectType: '',
      subjects: [],
      levels: [],
      pedagogy: 'Standard',
      customPedagogy: '',
      wordCount: 5000,
      wordDistribution: 'balanced',
      wordEnforcement: 'flexible',
      targetLanguage: 'English',
      goal: 'Teaching',
      complexity: 'Intermediate',
      culturalIntegration: 'Standard',
      terminology: 'Content-Language',
      markers: 'Headings',
      standards: [],
      customStandards: [],
      structure: 'Traditional',
      formatting: 'Standard',
      scriptType: 'Latin',
      uploadedDocuments: [],
      needsDocumentUpload: false,
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString()
    },
    steps: WIZARD_STEPS.length,
    saveKey: 'project-creation'
  });

  const handleStepNavigation = () => {
    if (currentStep === 0 && !formData.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please provide a name for your project.",
        variant: "destructive"
      });
      return;
    }

    // Skip system config if using a template
    if (currentStep === 1 && formData.quickStart !== 'custom') {
      // Could apply template presets here
      goToStep(6); // Skip to summary for quick start templates
      return;
    }

    // Check if documents should be collected
    if (currentStep === 4) {
      const needsDocuments = 
        formData.standards.includes('custom') || 
        formData.customStandards.length > 0 ||
        formData.projectType === 'Custom' ||
        formData.pedagogy === 'Custom' ||
        formData.terminology === 'Custom' ||
        formData.markers === 'Custom' ||
        formData.structure === 'Custom';
      
      updateFormData({ needsDocumentUpload: needsDocuments });
      
      if (!needsDocuments) {
        // Skip documents step
        goToStep(6);
        return;
      }
    }
    
    nextStep();
  };

  const handlePrevStep = () => {
    if (currentStep === 6 && !formData.needsDocumentUpload) {
      // Skip back over the documents step
      goToStep(4);
    } else if (currentStep === 6 && formData.quickStart !== 'custom') {
      // If using template, go back to quick start
      goToStep(1);
    } else {
      prevStep();
    }
  };

  const handleComplete = () => {
    // Update last modified timestamp before completing
    updateFormData({
      lastModified: new Date().toISOString()
    });
    
    toast({
      title: "Project created successfully",
      description: `Your project "${formData.name}" has been created.`,
    });
    
    // Clear saved form data
    localStorage.removeItem('wizard-form-project-creation');
    
    // Simulate project creation
    setTimeout(() => {
      navigate('/projects');
    }, 1000);
  };

  const getVisibleSteps = () => {
    if (!WIZARD_STEPS || !Array.isArray(WIZARD_STEPS)) {
      console.error('WIZARD_STEPS is not properly defined');
      return [];
    }
    
    return WIZARD_STEPS.map(step => ({
      ...step,
      hidden: (step.id === 5 && !formData.needsDocumentUpload) ||
              (formData.quickStart !== 'custom' && 
               (step.id === 2 || step.id === 3 || step.id === 4 || step.id === 5))
    }));
  };

  return {
    currentStep,
    formData,
    updateFormData,
    visibleSteps: getVisibleSteps(),
    hasVisited,
    handleStepNavigation,
    handlePrevStep,
    handleComplete,
    isFirstStep,
    isLastStep
  };
};

export default ConfigurationWizardContainer;
