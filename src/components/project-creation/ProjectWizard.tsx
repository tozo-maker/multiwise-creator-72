
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ProjectBasicsStep } from './steps/ProjectBasicsStep';
import { ProjectConfigStep } from './steps/ProjectConfigStep';
import { KnowledgeBaseStep } from './steps/KnowledgeBaseStep';
import { FinalReviewStep } from './steps/FinalReviewStep';
import { WizardSteps } from './WizardSteps';

interface ProjectData {
  name: string;
  description: string;
  type: string;
  language: string;
  targetAudience: string;
  complexity: string;
  templateId?: string;
  quickStart?: string;
  hasKnowledgeBase?: boolean;
  knowledgeBaseFiles?: string[];
}

interface ProjectWizardProps {
  onComplete: (projectId: string) => void;
}

export function ProjectWizard({ 
  onComplete
}: ProjectWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [formData, setFormData] = useState<ProjectData>({
    name: '',
    description: '',
    type: '',
    language: 'English',
    targetAudience: '',
    complexity: 'Intermediate',
    quickStart: 'custom',
  });
  const { toast } = useToast();
  
  // Define wizard steps
  const steps = [
    { id: 0, name: 'Project Info' },
    { id: 1, name: 'Quick Start' },
    { id: 2, name: 'System Config' },
    { id: 3, name: 'Project Config' },
    { id: 4, name: 'Language Config' },
    { id: 5, name: 'Documents' },
    { id: 6, name: 'Summary' }
  ];
  
  const updateFormData = (data: Partial<ProjectData>) => {
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
    
    // Handle special navigation logic
    if (currentStep === 1 && formData.quickStart !== 'custom') {
      // Skip to final step if using a template
      setCurrentStep(6);
      setVisitedSteps(prev => {
        const updated = new Set(prev);
        updated.add(6);
        return updated;
      });
      return;
    }
    
    if (currentStep === 4) {
      // Check if we need to skip the documents step
      const needsDocuments = false; // Logic to determine if documents are needed
      
      if (!needsDocuments) {
        setCurrentStep(6);
        setVisitedSteps(prev => {
          const updated = new Set(prev);
          updated.add(6);
          return updated;
        });
        return;
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setVisitedSteps(prev => {
        const updated = new Set(prev);
        updated.add(currentStep + 1);
        return updated;
      });
    }
  };
  
  const prevStep = () => {
    if (currentStep === 6 && !formData.hasKnowledgeBase) {
      // Skip back over the documents step
      setCurrentStep(4);
    } else if (currentStep === 6 && formData.quickStart !== 'custom') {
      // If using template, go back to quick start
      setCurrentStep(1);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const goToStep = (stepId: number) => {
    if (visitedSteps.has(stepId)) {
      setCurrentStep(stepId);
    }
  };
  
  const handleCreate = () => {
    // In a real app, you would send the data to an API
    toast({
      title: "Creating project...",
      description: "Your project is being set up."
    });
    
    setTimeout(() => {
      // Generate a random project ID for demo purposes
      const projectId = 'proj_' + Math.random().toString(36).substr(2, 9);
      onComplete(projectId);
    }, 1500);
  };
  
  // Get current component
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ProjectBasicsStep data={formData} updateData={updateFormData} />;
      case 3:
        return <ProjectConfigStep data={formData} updateData={updateFormData} />;
      case 5:
        return <KnowledgeBaseStep data={formData} updateData={updateFormData} />;
      case 6:
        return <FinalReviewStep data={formData} />;
      default:
        return (
          <div className="space-y-4 py-6">
            <p className="text-lg font-medium">This step is under construction</p>
            <p className="text-slate-500">
              This wizard step is not fully implemented in the current demo. Please continue to the next step.
            </p>
          </div>
        );
    }
  };
  
  const hasVisited = (stepId: number): boolean => {
    return visitedSteps.has(stepId);
  };
  
  return (
    <div className="space-y-6">
      <WizardSteps 
        steps={steps}
        currentStep={currentStep}
        hasVisited={hasVisited}
        onStepClick={goToStep}
      />
      
      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
        <div className="p-6">
          {renderStepContent()}
        </div>
        
        <div className="flex justify-between p-6 border-t border-slate-200 dark:border-slate-800">
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
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleCreate} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Create Project
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
