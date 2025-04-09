
import { useState } from 'react';
import { ProjectService } from '@/services/ProjectService';
import { toast } from '@/hooks/use-toast';

export interface ProjectData {
  name: string;
  description: string;
  type: string;
  language: string;
  targetAudience: string;
  complexity: string;
  templateId: string;
  hasKnowledgeBase?: boolean;
  knowledgeBaseFiles?: string[];
}

export interface WizardStep {
  id: number;
  name: string;
}

export const useProjectWizard = (onComplete: (projectId: string) => void) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasVisited, setHasVisited] = useState<number[]>([0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectData>({
    name: '',
    description: '',
    type: 'Textbook', // Default value
    language: 'English', // Default value
    targetAudience: 'Students',
    complexity: 'Intermediate',
    templateId: 'custom',
  });
  
  const steps: WizardStep[] = [
    { id: 0, name: 'Project Basics' },
    { id: 1, name: 'Quick Start' },
    { id: 2, name: 'System Config' },
    { id: 3, name: 'Project Config' },
    { id: 4, name: 'Language Config' },
    { id: 5, name: 'Knowledge Base' },
    { id: 6, name: 'Review' },
  ];
  
  const updateFormData = (data: Partial<ProjectData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      if (!hasVisited.includes(newStep)) {
        setHasVisited([...hasVisited, newStep]);
      }
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const goToStep = (step: number) => {
    if (hasVisited.includes(step)) {
      setCurrentStep(step);
    }
  };
  
  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      
      // Create project using ProjectService
      const project = await ProjectService.create({
        name: formData.name,
        description: formData.description,
        type: formData.type,
        targetLanguage: formData.language,
      });
      
      toast({
        title: "Project created",
        description: "Your project has been created successfully.",
      });
      
      // Pass the project ID to the callback
      onComplete(project.id);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating project",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
    isSubmitting,
    handleCreate
  };
};
