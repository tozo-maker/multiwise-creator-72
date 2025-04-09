
import React from 'react';
import { Wizard } from '@/components/shared/wizard/Wizard';
import { WizardStep } from '@/contexts/WizardContext';
import { useToast } from '@/hooks/use-toast';
import { ProjectBasicsStep } from './steps/ProjectBasicsStep';
import { QuickStartStep } from './steps/QuickStartStep';
import { SystemConfigStep } from './steps/SystemConfigStep';
import { ProjectConfigStep } from './steps/ProjectConfigStep';
import { LanguageConfigStep } from './steps/LanguageConfigStep';
import { KnowledgeBaseStep } from './steps/KnowledgeBaseStep';
import { FinalReviewStep } from './steps/FinalReviewStep';
import { ProjectService } from '@/services/ProjectService';
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
  quickStart?: string;
  hasKnowledgeBase?: boolean;
  knowledgeBaseFiles?: string[];
}

interface UnifiedProjectWizardProps {
  onComplete: (projectId: string) => void;
}

export function UnifiedProjectWizard({ onComplete }: UnifiedProjectWizardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Define wizard steps
  const steps: WizardStep[] = [
    { id: 0, name: 'Project Info' },
    { id: 1, name: 'Quick Start' },
    { id: 2, name: 'System Config' },
    { id: 3, name: 'Project Config' },
    { id: 4, name: 'Language Config' },
    { id: 5, name: 'Documents' },
    { id: 6, name: 'Summary' }
  ];
  
  const initialData: ProjectData = {
    name: '',
    description: '',
    type: 'Textbook',
    language: 'English',
    targetAudience: 'Students',
    complexity: 'Intermediate',
    quickStart: 'custom',
    templateId: 'custom',
  };
  
  // Custom navigation logic
  const navigateLogic = (currentStep: number, formData: ProjectData, goToStep: (step: number) => void) => {
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
      goToStep(6);
      return;
    }
    
    if (currentStep === 4) {
      // Check if we need to skip the documents step
      const needsDocuments = false; // Logic to determine if documents are needed
      
      if (!needsDocuments) {
        goToStep(6);
        return;
      }
    }
    
    // Default navigation to next step
    goToStep(currentStep + 1);
  };
  
  const renderStep = (stepId: number, formData: ProjectData, updateData: (data: Partial<ProjectData>) => void) => {
    switch (stepId) {
      case 0:
        return <ProjectBasicsStep data={formData} updateData={updateData} />;
      case 1:
        return <QuickStartStep data={formData} updateData={updateData} />;
      case 2:
        return <SystemConfigStep data={formData} updateData={updateData} />;
      case 3:
        return <ProjectConfigStep data={formData} updateData={updateData} />;
      case 4:
        return <LanguageConfigStep data={formData} updateData={updateData} />;
      case 5:
        return <KnowledgeBaseStep data={formData} updateData={updateData} />;
      case 6:
        return <FinalReviewStep data={formData} />;
      default:
        return null;
    }
  };
  
  const handleComplete = async (data: ProjectData) => {
    toast({
      title: "Creating project...",
      description: "Your project is being set up."
    });
    
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a project",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    
    try {
      console.log('Creating project with data:', {
        name: data.name,
        description: data.description,
        type: data.type,
        targetLanguage: data.language,
      });
      
      // Create project using ProjectService
      const project = await ProjectService.create({
        name: data.name,
        description: data.description,
        type: data.type || 'Textbook',
        targetLanguage: data.language || 'English',
      });
      
      console.log('Project created:', project);
      
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
    }
  };
  
  return (
    <Wizard
      steps={steps}
      initialData={initialData}
      saveKey="project-wizard"
      onComplete={handleComplete}
      renderStep={renderStep}
      navigateLogic={navigateLogic}
    />
  );
}
