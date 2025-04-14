
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
      
      // First check if project_config table exists
      try {
        const { count, error: tableCheckError } = await supabase
          .from('project_config')
          .select('*', { count: 'exact', head: true })
          .limit(1);
        
        // If table exists (no error), proceed with config check
        if (!tableCheckError) {
          // Check if config exists for this project
          const { data: existingConfig, error: checkError } = await supabase
            .from('project_config')
            .select('id')
            .eq('project_id', projectId)
            .maybeSingle();
          
          if (checkError) {
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
        } else {
          console.error('Error checking project_config table:', tableCheckError);
          throw new Error('Project configuration table does not exist or is not accessible');
        }
      } catch (error: any) {
        console.error('Error saving configuration:', error);
        throw error;
      }
      
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
