
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SaveConfigurationButtonProps {
  onSave: () => void;
  projectId: string;
  configData: any;
}

export const SaveConfigurationButton: React.FC<SaveConfigurationButtonProps> = ({ 
  onSave, 
  projectId,
  configData 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!projectId) {
      toast({
        title: "Missing project ID",
        description: "Project ID is required to save configuration",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      console.log('Saving configuration for project:', projectId);
      console.log('Config data to save:', configData);
      
      // Extract relevant data from configData
      const configToSave = {
        project_id: projectId,
        name: configData.name || '',
        projectType: configData.projectType || '',
        targetLanguage: configData.targetLanguage || '',
        subjects: configData.subjects || [],
        levels: configData.levels || ['Secondary', 'High School'],
        pedagogy: configData.pedagogy || 'Standard',
        complexity: configData.complexity || 'Intermediate',
        updated_at: new Date().toISOString(),
      };

      // First check if project_config exists
      const { data: tableExists, error: tableCheckError } = await supabase
        .from('project_config')
        .select('count(*)', { count: 'exact', head: true });
      
      if (tableCheckError && !tableCheckError.message.includes('relation "project_config" does not exist')) {
        console.error('Error checking project_config table:', tableCheckError);
        throw tableCheckError;
      }
      
      // Check if config exists for this project
      const { data: existingConfig, error: checkError } = await supabase
        .from('project_config')
        .select('id')
        .eq('project_id', projectId)
        .maybeSingle();
      
      if (checkError && !checkError.message.includes('relation "project_config" does not exist')) {
        console.error('Error checking existing config:', checkError);
        throw checkError;
      }
      
      let result;
      
      if (existingConfig) {
        // Update existing config
        console.log('Updating existing config with ID:', existingConfig.id);
        const { data, error } = await supabase
          .from('project_config')
          .update(configToSave)
          .eq('id', existingConfig.id)
          .select();
          
        if (error) throw error;
        result = data;
        
      } else {
        // Insert new config
        console.log('Creating new config for project:', projectId);
        const { data, error } = await supabase
          .from('project_config')
          .insert({
            ...configToSave,
            created_at: new Date().toISOString(),
          })
          .select();
          
        if (error) throw error;
        result = data;
      }
      
      console.log('Configuration saved successfully:', result);
      
      toast({
        title: "Configuration saved",
        description: "Project settings have been updated successfully",
      });
      
      // Call the parent onSave callback
      onSave();
      
    } catch (error: any) {
      console.error('Error saving configuration:', error);
      
      toast({
        title: "Error saving configuration",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button 
      onClick={handleSave} 
      className="gap-2"
      disabled={isSaving}
    >
      {isSaving ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      Save Changes
    </Button>
  );
};
