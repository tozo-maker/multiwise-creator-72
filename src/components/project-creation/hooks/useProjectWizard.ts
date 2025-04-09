
import { useState } from 'react';
import { ProjectService } from '@/services/ProjectService';
import { toast } from '@/hooks/use-toast';

interface ProjectFormData {
  name: string;
  description: string;
  type: string;
  targetLanguage: string;
  // Add other form fields as needed
}

export const useProjectWizard = (onComplete: (projectId: string) => void) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasVisited, setHasVisited] = useState<number[]>([0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    type: 'Textbook', // Default value
    targetLanguage: 'English', // Default value
  });
  
  const steps = [
    { id: 0, label: 'Project Basics' },
    { id: 1, label: 'Project Configuration' },
    { id: 2, label: 'Language Settings' },
    { id: 3, label: 'Knowledge Base' },
    { id: 4, label: 'Review' },
  ];
  
  const updateFormData = (data: Partial<ProjectFormData>) => {
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
        targetLanguage: formData.targetLanguage,
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
