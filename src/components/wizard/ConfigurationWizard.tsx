
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectNameStep } from './steps/ProjectNameStep';
import { SystemConfigStep } from './steps/SystemConfigStep';
import { ProjectConfigStep } from './steps/ProjectConfigStep';
import { LanguageConfigStep } from './steps/LanguageConfigStep';
import { DocumentUploadStep } from './steps/DocumentUploadStep';
import { SummaryStep } from './steps/SummaryStep';
import { useToast } from '@/hooks/use-toast';
import { useWizardForm } from '@/hooks/useWizardForm';
import { WizardStepIndicator, WizardStep } from './WizardStepIndicator';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';

const WIZARD_STEPS: WizardStep[] = [
  { id: 0, name: 'Project Info' },
  { id: 1, name: 'System Config' },
  { id: 2, name: 'Project Config' },
  { id: 3, name: 'Language Config' },
  { id: 4, name: 'Documents' },
  { id: 5, name: 'Summary' }
];

interface ConfigData {
  name: string;
  quickStart: string;
  // System Config
  interfaceLanguage: string;
  experienceLevel: string;
  interactionMode: string;
  outputDetail: string;
  systemBehavior: string;
  // Project Config
  projectType: string;
  subjects: string[];
  levels: string[];
  pedagogy: string;
  wordCount: number;
  // Language Config
  targetLanguage: string;
  goal: string;
  complexity: string;
  culturalIntegration: string;
  terminology: string;
  markers: string;
  standards: string;
  structure: string;
  formatting: string;
  // Documents
  uploadedDocuments: { name: string; description: string; }[];
  needsDocumentUpload: boolean;
}

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

  // Get visible steps (hiding document step if not needed)
  const getVisibleSteps = (): WizardStep[] => {
    if (!WIZARD_STEPS || !Array.isArray(WIZARD_STEPS)) {
      console.error('WIZARD_STEPS is not properly defined');
      return [];
    }
    
    return WIZARD_STEPS.map(step => ({
      ...step,
      hidden: step.id === 4 && !formData.needsDocumentUpload
    }));
  };
  
  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return "Project Information";
      case 1: return "System Configuration";
      case 2: return "Project Configuration";
      case 3: return "Language & Content Configuration";
      case 4: return "Upload Project Documents";
      case 5: return "Review & Create";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 0: return "Name your project and choose a starting point.";
      case 1: return "Configure how you want to interact with the system.";
      case 2: return "Define the educational project specifications.";
      case 3: return "Set language preferences and content parameters.";
      case 4: return "Upload documents needed for your custom configuration.";
      case 5: return "Review your configuration and create your project.";
      default: return "";
    }
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
          <CardTitle>{getStepTitle()}</CardTitle>
          <CardDescription>{getStepDescription()}</CardDescription>
        </CardHeader>
        
        <CardContent>
          {renderStepContent()}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-slate-200 pt-4">
          <Button 
            variant="outline" 
            onClick={handlePrevStep} 
            disabled={isFirstStep}
          >
            Back
          </Button>
          
          <div>
            {!isLastStep ? (
              <Button 
                className="bg-brand-500 hover:bg-brand-600 text-white"
                onClick={handleStepNavigation}
              >
                Continue
              </Button>
            ) : (
              <Button 
                className="bg-brand-500 hover:bg-brand-600 text-white"
                onClick={handleComplete}
              >
                Create Project
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
