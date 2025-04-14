
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
      
      // First, check if project_config table exists by checking its definition
      const { error: tableCheckError } = await supabase
        .from('project_config')
        .select('count(*)', { count: 'exact', head: true });
        
      if (tableCheckError) {
        console.error('Error checking if table exists:', tableCheckError);
        if (tableCheckError.message.includes('does not exist') || 
            tableCheckError.message.includes('relation') ||
            tableCheckError.code === '42P01') {
          
          toast({
            title: "Database setup required",
            description: "The project_config table doesn't exist yet. Please run the database migration.",
            variant: "destructive"
          });
          
          console.log('Please run the database migration from supabase/migrations/20250414001000_create_project_config.sql');
          setIsSaving(false);
          return;
        }
      }
        
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
