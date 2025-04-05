
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ProjectBasicsStep } from './steps/ProjectBasicsStep';
import { ProjectConfigStep } from './steps/ProjectConfigStep';
import { KnowledgeBaseStep } from './steps/KnowledgeBaseStep';
import { FinalReviewStep } from './steps/FinalReviewStep';
import { useToast } from '@/hooks/use-toast';

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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    language: 'English',
    targetAudience: '',
    complexity: 'Intermediate',
    templateId,
  });
  const { toast } = useToast();
  
  // Define wizard steps
  const steps = [
    { title: 'Project Basics', component: ProjectBasicsStep },
    { title: 'Configuration', component: ProjectConfigStep },
    { title: 'Knowledge Base', component: KnowledgeBaseStep },
    { title: 'Review & Create', component: FinalReviewStep },
  ];
  
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data });
  };
  
  const nextStep = () => {
    // Validate before moving to next step
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
    // In a real app, you would send the data to an API
    // For now, we'll simulate creation with a timeout
    toast({
      title: "Creating project...",
      description: "Your project is being set up."
    });
    
    setTimeout(() => {
      // Generate a random project ID for demo purposes
      const projectId = 'proj_' + Math.random().toString(36).substr(2, 9);
      onComplete(projectId);
    }, 2000);
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  
  // Get current component
  const StepComponent = steps[currentStep].component;
  
  return (
    <div className="space-y-6 py-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{steps[currentStep].title}</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      <div className="min-h-[300px]">
        <StepComponent 
          data={formData} 
          updateData={updateFormData}
          isMobile={isMobile}
        />
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep} className="bg-brand-500 hover:bg-brand-600">
            Continue
          </Button>
        ) : (
          <Button onClick={handleCreate} className="bg-brand-500 hover:bg-brand-600">
            Create Project
          </Button>
        )}
      </div>
    </div>
  );
}
