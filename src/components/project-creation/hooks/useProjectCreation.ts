
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProjectService } from '@/services/ProjectService';
import { ProjectData } from './useProjectWizard';

export function useProjectCreation({ onComplete }: { onComplete: (projectId: string) => void }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  
  const processKnowledgeBaseFiles = async (projectId: string, fileNames: string[]) => {
    if (!user || !fileNames.length) return [];
    
    try {
      const results = fileNames.map(async (fileName) => {
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
        
        const category = 
          ['pdf', 'doc', 'docx'].includes(fileExtension) ? 'Documents' :
          ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension) ? 'Images' :
          'Other';
        
        const fileSize = 'Unknown';
              
        const { data: fileData, error: dbError } = await supabase
          .from('knowledge_base_files')
          .insert({
            project_id: projectId,
            user_id: user.id,
            name: fileName,
            description: `File uploaded during project creation for ${projectId}`,
            file_type: fileExtension,
            category: category,
            size: fileSize,
            url: ''
          })
          .select()
          .single();
            
        if (dbError) {
          console.error('Error adding file to database:', dbError);
          throw dbError;
        }
        
        return fileData;
      });
      
      return await Promise.all(results);
    } catch (error) {
      console.error('Error processing knowledge base files:', error);
      toast({
        title: "Warning",
        description: "Some files could not be processed. You can add them later in the Knowledge Base.",
        variant: "destructive"
      });
      return [];
    }
  };
  
  const handleProjectCreate = async (data: ProjectData) => {
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
      const project = await ProjectService.create({
        name: data.name,
        description: data.description || '',
        type: data.type || 'Textbook',
        targetLanguage: data.language || 'English',
        deadline: data.deadline
      });
      
      if (project && project.id) {
        if (data.hasKnowledgeBase && data.knowledgeBaseFiles && data.knowledgeBaseFiles.length > 0) {
          toast({
            title: "Processing files",
            description: `Recording ${data.knowledgeBaseFiles.length} files to knowledge base...`
          });
          
          await processKnowledgeBaseFiles(project.id, data.knowledgeBaseFiles);
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

  return {
    isCreating,
    handleProjectCreate
  };
}
