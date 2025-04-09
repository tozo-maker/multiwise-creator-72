
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProjectData {
  name: string;
  description: string;
  type: string;
  language: string;
  targetAudience: string;
  complexity: string;
  templateId: string;
  quickStart?: string;
  hasKnowledgeBase?: boolean;
  knowledgeBaseFiles?: string[];
}

export function useProjectWizard(onComplete: (projectId: string) => void) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProjectData>({
    name: '',
    description: '',
    type: '',
    language: 'English',
    targetAudience: '',
    complexity: 'Intermediate',
    templateId: 'custom',
  });
  const [hasVisited, setHasVisited] = useState<number[]>([0]);
  const { user } = useAuth();

  const steps = [
    { id: 0, name: 'Project Basics' },
    { id: 1, name: 'Quick Start' },
    { id: 2, name: 'System Config' },
    { id: 3, name: 'Project Config' },
    { id: 4, name: 'Language Config' },
    { id: a5, name: 'Knowledge Base' },
    { id: 6, name: 'Review' },
  ];

  useEffect(() => {
    // Load saved form data from localStorage
    const savedData = localStorage.getItem('project-wizard-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Failed to parse saved form data', error);
      }
    }
  }, []);

  const updateFormData = (data: Partial<ProjectData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...data };
      
      // Save to localStorage
      localStorage.setItem('project-wizard-data', JSON.stringify(updated));
      
      return updated;
    });
  };

  const nextStep = () => {
    if (currentStep === 0 && !formData.name) {
      toast({
        title: "Project name required",
        description: "Please enter a project name to continue.",
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

  const goToStep = (step: number) => {
    if (hasVisited.includes(step)) {
      setCurrentStep(step);
    } else if (step <= Math.max(...hasVisited) + 1) {
      setCurrentStep(step);
      setHasVisited(prev => [...prev, step]);
    }
  };

  const handleCreate = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a project.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: formData.name,
          description: formData.description,
          type: formData.type || 'Textbook',
          target_language: formData.language,
          user_id: user.id,
          progress: 0,
          status: 'active'
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      // Clear saved form data
      localStorage.removeItem('project-wizard-data');
      
      // Call the completion callback with the new project ID
      onComplete(data.id);
      
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Project creation failed",
        description: error.message,
        variant: "destructive"
      });
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
    handleCreate
  };
}
