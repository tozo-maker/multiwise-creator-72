
import { useState } from 'react';
import { ProjectService } from '@/services/ProjectService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    // Basic form validation
    if (currentStep === 0 && !formData.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please provide a name for your project.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < steps.length - 1) {
      const nextStepId = currentStep + 1;
      setCurrentStep(nextStepId);
      
      if (!hasVisited.includes(nextStepId)) {
        setHasVisited(prev => [...prev, nextStepId]);
      }
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const goToStep = (stepId: number) => {
    if (hasVisited.includes(stepId)) {
      setCurrentStep(stepId);
    }
  };
  
  const handleCreate = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Check if user is authenticated
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a project",
          variant: "destructive"
        });
        setIsSubmitting(false);
        navigate("/auth");
        return;
      }
      
      // Validate required fields
      if (!formData.name.trim()) {
        toast({
          title: "Missing information",
          description: "Please provide a project name",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log('Creating project with data:', {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        targetLanguage: formData.language,
      });
      
      // Create project using ProjectService
      const project = await ProjectService.create({
        name: formData.name,
        description: formData.description,
        type: formData.type,
        targetLanguage: formData.language,
      });
      
      console.log('Project created:', project);
      
      toast({
        title: "Project created",
        description: `Your project "${formData.name}" has been created successfully.`
      });
      
      // Callback with the new project ID
      if (project && project.id) {
        onComplete(project.id);
      } else {
        throw new Error("Failed to get project ID");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "There was an error creating your project. Please try again.",
        variant: "destructive"
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
    handleCreate,
    isSubmitting
  };
};
