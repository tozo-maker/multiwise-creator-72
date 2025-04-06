
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
import { MainLayout } from '@/components/layout/MainLayout';

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

  return (
    <MainLayout contentWidth="default">
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
    </MainLayout>
  );
};

export default ConfigurationWizard;
