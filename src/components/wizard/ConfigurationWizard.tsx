
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useWizardForm } from '@/hooks/useWizardForm';
import { WizardStepIndicator } from './WizardStepIndicator';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { WizardContent } from './WizardContent';
import { WizardFooter } from './WizardFooter';
import { WIZARD_STEPS, getStepTitle, getStepDescription } from './wizardSteps';
import { ConfigData } from './types';

export const ConfigurationWizard = () => {
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
      interactionMode: 'Guided',
      outputDetail: 'Detailed',
      systemBehavior: 'Balanced',
      projectType: 'Textbook',
      subjects: [],
      levels: [],
      pedagogy: 'Standard',
      wordCount: 5000,
      targetLanguage: 'Spanish',
      goal: 'Teaching',
      complexity: 'Intermediate',
      culturalIntegration: 'Moderate',
      terminology: 'Standard',
      markers: 'Standard',
      standards: 'Default',
      structure: 'Default',
      formatting: 'Default',
      uploadedDocuments: [],
      needsDocumentUpload: false
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

    // Check if documents should be collected (custom options selected or Custom project type)
    if (currentStep === 3) {
      const needsDocuments = formData.standards === 'Custom' || 
                            formData.projectType.startsWith('Custom:') ||
                            formData.terminology.startsWith('Custom:') ||
                            formData.markers.startsWith('Custom:') ||
                            formData.structure.startsWith('Custom:');
      
      updateFormData({ needsDocumentUpload: needsDocuments });
      
      if (needsDocuments) {
        nextStep();
      } else {
        // Skip documents step
        goToStep(5);
      }
    } else {
      nextStep();
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 5 && !formData.needsDocumentUpload) {
      // Skip back over the documents step
      goToStep(3);
    } else {
      prevStep();
    }
  };

  const handleComplete = () => {
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

  // Get visible steps (hiding document step if not needed)
  const getVisibleSteps = () => {
    if (!WIZARD_STEPS || !Array.isArray(WIZARD_STEPS)) {
      console.error('WIZARD_STEPS is not properly defined');
      return [];
    }
    
    return WIZARD_STEPS.map(step => ({
      ...step,
      hidden: step.id === 4 && !formData.needsDocumentUpload
    }));
  };

  return (
    <div className="w-full">
      <PageBreadcrumbs 
        items={[
          { label: 'Projects', path: '/projects' },
          { label: 'Create New Project' }
        ]}
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create New Project</h1>
        <p className="text-slate-500 mt-2">
          Configure your educational content project by following these steps.
        </p>
      </div>
      
      <WizardStepIndicator 
        steps={getVisibleSteps()}
        currentStep={currentStep}
        hasVisited={hasVisited}
        className="mb-8"
      />
      
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>{getStepTitle(currentStep)}</CardTitle>
          <CardDescription>{getStepDescription(currentStep)}</CardDescription>
        </CardHeader>
        
        <WizardContent 
          currentStep={currentStep}
          formData={formData}
          updateFormData={updateFormData}
        />
        
        <WizardFooter
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onPrev={handlePrevStep}
          onNext={handleStepNavigation}
          onComplete={handleComplete}
        />
      </Card>
    </div>
  );
};
