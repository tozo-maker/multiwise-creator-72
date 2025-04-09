
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ProjectBasicsStep } from './steps/ProjectBasicsStep';
import { ProjectConfigStep } from './steps/ProjectConfigStep';
import { KnowledgeBaseStep } from './steps/KnowledgeBaseStep';
import { FinalReviewStep } from './steps/FinalReviewStep';
import { useToast } from '@/hooks/use-toast';
import { WizardStepIndicator } from '@/components/wizard/WizardStepIndicator';
import { ProjectData } from './hooks/useProjectWizard';

interface ProjectCreationWizardProps {
  templateId: string;
  onComplete: (projectId: string) => void;
  isMobile?: boolean;
}

export function ProjectCreationWizard({ 
  templateId, 
  onComplete,
  isMobile = false 
}: ProjectCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProjectData>({
    name: '',
    description: '',
    type: '',
    language: 'English',
    targetAudience: '',
    complexity: 'Intermediate',
    templateId,
    quickStart: 'custom',
    knowledgeBaseFiles: [],
  });
  const { toast } = useToast();
  
  const steps = [
    { id: 0, name: 'Project Basics' },
    { id: 1, name: 'Configuration' },
    { id: 2, name: 'Knowledge Base' },
    { id: 3, name: 'Review & Create' }
  ];
  
  const updateFormData = (data: Partial<ProjectData>) => {
    setFormData({ ...formData, ...data });
  };
  
  const nextStep = () => {
    if (currentStep === 0 && !formData.name) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleCreate = () => {
    toast({
      title: "Creating project...",
      description: "Your project is being set up."
    });
    
    setTimeout(() => {
      const projectId = 'proj_' + Math.random().toString(36).substr(2, 9);
      onComplete(projectId);
    }, 2000);
  };
  
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  
  const hasVisited = (stepId: number) => {
    return visitedSteps.has(stepId) || stepId <= currentStep;
  };
  
  const goToStep = (stepId: number) => {
    if (hasVisited(stepId)) {
      setCurrentStep(stepId);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ProjectBasicsStep data={formData} updateData={updateFormData} isMobile={isMobile} />;
      case 1:
        return <ProjectConfigStep data={formData} updateData={updateFormData} isMobile={isMobile} />;
      case 2:
        return <KnowledgeBaseStep data={formData} updateData={updateFormData} isMobile={isMobile} />;
      case 3:
        return <FinalReviewStep data={formData} isMobile={isMobile} />;
      default:
        return null;
    }
  };
  
  React.useEffect(() => {
    setVisitedSteps(prev => {
      const updated = new Set(prev);
      updated.add(currentStep);
      return updated;
    });
  }, [currentStep]);
  
  return (
    <div className="space-y-6 w-full">
      <div className="space-y-4">
        <WizardStepIndicator 
          steps={steps} 
          currentStep={currentStep} 
          hasVisited={hasVisited}
          onStepClick={goToStep}
          className="mb-2"
        />
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{steps[currentStep].name}</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
      
      <div className="min-h-[300px] w-full">
        {renderStepContent()}
      </div>
      
      <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 0}
          className="border-slate-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Back
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button 
            onClick={nextStep} 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continue
          </Button>
        ) : (
          <Button 
            onClick={handleCreate} 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create Project
          </Button>
        )}
      </div>
    </div>
  );
}
