
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { useToast } from '@/components/ui/use-toast';

const steps = [
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
  const [currentStep, setCurrentStep] = useState(0);
  const [configData, setConfigData] = useState<ConfigData>({
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
  });

  const updateConfigData = (data: Partial<ConfigData>) => {
    setConfigData({ ...configData, ...data });
  };

  const nextStep = () => {
    if (currentStep === 0 && !configData.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please provide a name for your project.",
        variant: "destructive"
      });
      return;
    }

    // Check if documents should be collected (custom options selected or Custom project type)
    if (currentStep === 3) {
      const needsDocuments = configData.standards === 'Custom' || 
                             configData.projectType.startsWith('Custom:') ||
                             configData.terminology.startsWith('Custom:') ||
                             configData.markers.startsWith('Custom:') ||
                             configData.structure.startsWith('Custom:');
      
      updateConfigData({ needsDocumentUpload: needsDocuments });
      setCurrentStep(needsDocuments ? 4 : 5);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep === 5 && configData.needsDocumentUpload) {
      setCurrentStep(4);
    } else if (currentStep === 5 && !configData.needsDocumentUpload) {
      setCurrentStep(3);
    } else if (currentStep === 4) {
      setCurrentStep(3);
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Project created successfully",
      description: `Your project "${configData.name}" has been created.`,
    });
    
    // Simulate project creation
    setTimeout(() => {
      navigate('/projects');
    }, 1000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ProjectNameStep data={configData} updateData={updateConfigData} />;
      case 1:
        return <SystemConfigStep data={configData} updateData={updateConfigData} />;
      case 2:
        return <ProjectConfigStep data={configData} updateData={updateConfigData} />;
      case 3:
        return <LanguageConfigStep data={configData} updateData={updateConfigData} />;
      case 4:
        return <DocumentUploadStep data={configData} updateData={updateConfigData} />;
      case 5:
        return <SummaryStep data={configData} />;
      default:
        return null;
    }
  };

  // Adjust the step display logic for document uploads
  const getDisplayStep = (stepId: number) => {
    if (stepId === 4 && !configData.needsDocumentUpload) {
      return { hidden: true };
    }
    if (stepId === 5 && !configData.needsDocumentUpload) {
      return { id: 4, name: steps[5].name };
    }
    return steps[stepId];
  };

  const visibleSteps = steps.filter((_, index) => 
    !(index === 4 && !configData.needsDocumentUpload)
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create New Project</h1>
        <p className="text-slate-500 mt-2">
          Configure your educational content project by following these steps.
        </p>
      </div>
      
      {/* Progress Stepper */}
      <div className="flex justify-center mb-8">
        <div className="flex">
          {visibleSteps.map((step) => {
            const displayStep = getDisplayStep(step.id);
            if (displayStep.hidden) return null;
            
            return (
              <div 
                key={step.id}
                className={cn(
                  "step-item",
                  { "active": currentStep === step.id },
                  { "complete": currentStep > step.id }
                )}
              >
                <div className={cn(
                  "step",
                  { "active": currentStep === step.id },
                  { "complete": currentStep > step.id }
                )}>
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5 step-icon" />
                  ) : (
                    step.id + 1
                  )}
                </div>
                <p className="step-label">{step.name}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>
            {currentStep === 0 && "Project Information"}
            {currentStep === 1 && "System Configuration"}
            {currentStep === 2 && "Project Configuration"}
            {currentStep === 3 && "Language & Content Configuration"}
            {currentStep === 4 && "Upload Project Documents"}
            {currentStep === 5 && "Review & Create"}
          </CardTitle>
          <CardDescription>
            {currentStep === 0 && "Name your project and choose a starting point."}
            {currentStep === 1 && "Configure how you want to interact with the system."}
            {currentStep === 2 && "Define the educational project specifications."}
            {currentStep === 3 && "Set language preferences and content parameters."}
            {currentStep === 4 && "Upload documents needed for your custom configuration."}
            {currentStep === 5 && "Review your configuration and create your project."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {renderStepContent()}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-slate-200 pt-4">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 0}
          >
            Back
          </Button>
          
          <div>
            {currentStep < 5 ? (
              <Button onClick={nextStep}>
                Continue
              </Button>
            ) : (
              <Button 
                className="bg-brand-500 hover:bg-brand-600"
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
