
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
      
      // Check if config exists for this project
      const { data: existingConfig, error: checkError } = await supabase
        .from('project_config')
        .select('id')
        .eq('project_id', projectId)
        .maybeSingle();
        
      if (checkError && !checkError.message.includes('does not exist')) {
        throw checkError;
      }
      
      // Extract relevant data from configData
      const configToSave = {
        project_id: projectId,
        name: configData.name,
        projectType: configData.projectType,
        targetLanguage: configData.targetLanguage,
        subjects: configData.subjects,
        levels: configData.levels,
        pedagogy: configData.pedagogy,
        complexity: configData.complexity || 'Intermediate',
        updated_at: new Date().toISOString(),
      };
      
      let result;
      
      if (existingConfig) {
        // Update existing config
        const { data, error } = await supabase
          .from('project_config')
          .update(configToSave)
          .eq('id', existingConfig.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
        
      } else {
        // Insert new config
        const { data, error } = await supabase
          .from('project_config')
          .insert({
            ...configToSave,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
          
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
