
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ProjectData {
  name: string;
  description: string;
  type: string;
  language: string;
  targetAudience: string;
  complexity: string;
  templateId: string; // Required
  quickStart?: string;
  hasKnowledgeBase?: boolean;
  knowledgeBaseFiles?: string[];
}

export function useProjectWizard(onComplete: (projectId: string) => void) {
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
    templateId: 'custom', // Default value
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

  const hasVisited = (stepId: number): boolean => {
    return visitedSteps.has(stepId);
  };

  return {
    currentStep,
    steps,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    hasVisited,
    handleCreate
  };
}
