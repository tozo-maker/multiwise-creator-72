import React, { useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

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
  knowledgeBaseFiles?: string[] | File[];
  deadline?: string;
}

interface UnifiedProjectWizardProps {
  onComplete: (projectId: string) => void;
}

export function UnifiedProjectWizard({ onComplete }: UnifiedProjectWizardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  
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
    hasKnowledgeBase: false,
    knowledgeBaseFiles: [],
    deadline: '',
  };
  
  const navigateLogic = (currentStep: number, formData: ProjectData, goToStep: (step: number) => void) => {
    if (currentStep === 0 && !formData.name) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 1 && formData.quickStart !== 'custom' && formData.quickStart !== '') {
      goToStep(5);
      return;
    }
    
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
  
  const processKnowledgeBaseFiles = async (projectId: string, files: File[]) => {
    if (!user || !files.length) return;
    
    console.log('Processing knowledge base files for project:', projectId);
    console.log('Files to process:', files);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${projectId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `project-files/${fileName}`;
        
        console.log('Uploading file:', file.name, 'to path:', filePath);
        
        const { error: uploadError } = await supabase.storage
          .from('project_files')
          .upload(filePath, file);
          
        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from('project_files')
          .getPublicUrl(filePath);
          
        console.log('File uploaded, public URL:', data.publicUrl);
        
        const category = file.type.includes('image') 
          ? 'Images' 
          : file.type.includes('pdf') 
            ? 'Documents' 
            : 'Other';
            
        const { data: fileData, error: dbError } = await supabase
          .from('knowledge_base_files')
          .insert({
            project_id: projectId,
            user_id: user.id,
            name: file.name,
            description: `File uploaded during project creation for ${projectId}`,
            file_type: fileExt || '',
            category: category,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            url: data.publicUrl
          })
          .select()
          .single();
          
        if (dbError) {
          console.error('Error adding file to database:', dbError);
          throw dbError;
        }
        
        console.log('File added to knowledge base:', fileData);
        
        return fileData;
      });
      
      const results = await Promise.all(uploadPromises);
      console.log('All files processed successfully:', results);
      
      return results;
    } catch (error) {
      console.error('Error processing knowledge base files:', error);
      toast({
        title: "Warning",
        description: "Some files could not be processed. You can add them later in the Knowledge Base.",
        variant: "destructive"
      });
    }
  };
  
  const handleComplete = async (data: ProjectData) => {
    if (isCreating) return;
    
    setIsCreating(true);
    
    toast({
      title: "Creating project...",
      description: "Your project is being set up."
    });
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a project",
        variant: "destructive"
      });
      navigate("/auth");
      setIsCreating(false);
      return;
    }
    
    try {
      console.log('Creating project with data:', {
        name: data.name,
        description: data.description,
        type: data.type,
        targetLanguage: data.language,
        deadline: data.deadline
      });
      
      const project = await ProjectService.create({
        name: data.name,
        description: data.description || '',
        type: data.type || 'Textbook',
        targetLanguage: data.language || 'English',
        deadline: data.deadline
      });
      
      console.log('Project created successfully:', project);
      
      if (project && project.id) {
        if (data.hasKnowledgeBase && data.knowledgeBaseFiles && data.knowledgeBaseFiles.length > 0) {
          const filesToUpload = data.knowledgeBaseFiles.filter(file => file instanceof File) as File[];
          
          if (filesToUpload.length > 0) {
            console.log(`Processing ${filesToUpload.length} knowledge base files`);
            toast({
              title: "Processing files",
              description: `Uploading ${filesToUpload.length} files to knowledge base...`
            });
            
            await processKnowledgeBaseFiles(project.id, filesToUpload);
          }
        }
        
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('wizard-form-project-wizard');
        }
        
        toast({
          title: "Project created",
          description: "Your project has been created successfully!"
        });
        
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
      setIsCreating(false);
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
      showStepIndicator={true}
      title="Create New Project"
      description="Configure your educational content project by following these steps."
      className="w-full"
    />
  );
}
