
import { useState, useEffect } from 'react';
import { ConfigData } from '@/components/wizard/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DatabaseService } from '@/services/DatabaseService';

interface UseProjectConfigurationProps {
  projectId?: string;
}

interface ProjectBasicInfo {
  id: string;
  name: string;
  type: string;
  targetLanguage: string;
}

export function useProjectConfiguration({ projectId }: UseProjectConfigurationProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectBasicInfo>({
    id: projectId || '',
    name: 'Loading...',
    type: 'Loading...',
    targetLanguage: 'Loading...'
  });

  // Initialize with default config values
  const [configData, setConfigData] = useState<ConfigData>({
    name: '',
    quickStart: 'custom',
    interfaceLanguage: 'English',
    experienceLevel: 'Intermediate',
    interactionMode: 'Guided',
    outputDetail: 'Detailed',
    systemBehavior: 'Balanced',
    projectType: '',
    customProjectType: '',
    subjects: [],
    levels: ['Secondary', 'High School'],
    pedagogy: 'Standard',
    customPedagogy: '',
    wordCount: 5000,
    wordDistribution: 'balanced',
    wordEnforcement: 'flexible',
    targetLanguage: '',
    goal: 'Teaching',
    complexity: 'Intermediate',
    culturalIntegration: 'Moderate',
    terminology: 'Standard',
    markers: 'Standard',
    standards: [],
    customStandards: [],
    structure: 'Default',
    formatting: 'Default',
    scriptType: 'Latin',
    uploadedDocuments: [],
    needsDocumentUpload: false,
    createdDate: new Date().toISOString(),
    lastModified: new Date().toISOString()
  });

  const updateConfigData = (data: Partial<ConfigData>) => {
    console.log('Updating config data with:', data);
    setConfigData({ ...configData, ...data });
    setSaveError(null); // Clear any previous save errors when making changes
  };

  const handleSaveChanges = () => {
    setConfigData({
      ...configData,
      lastModified: new Date().toISOString()
    });
  };

  useEffect(() => {
    const fetchProjectAndConfig = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      setSaveError(null);
      
      try {
        console.log('Fetching project and config data for project:', projectId);
        // Fetch project data
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (projectError) throw projectError;
        
        if (projectData) {
          console.log('Project data fetched:', projectData);
          
          setProject({
            id: projectData.id,
            name: projectData.name,
            type: projectData.type,
            targetLanguage: projectData.target_language
          });
          
          // Set basic project info regardless of config presence
          setConfigData(prevData => ({
            ...prevData,
            name: projectData.name,
            projectType: projectData.type,
            targetLanguage: projectData.target_language
          }));
          
          // Ensure config table exists
          await DatabaseService.ensureProjectConfigTableExists();
          
          // Get full config data for this project if it exists
          const configData = await DatabaseService.getProjectConfig(projectId);
          
          if (configData) {
            // Update state with existing configuration
            console.log('Found existing configuration:', configData);
            setConfigData(prevData => ({
              ...prevData,
              name: projectData.name,
              projectType: configData.projectType || projectData.type,
              targetLanguage: configData.targetLanguage || projectData.target_language,
              subjects: configData.subjects || [],
              levels: configData.levels || ['Secondary', 'High School'],
              pedagogy: configData.pedagogy || 'Standard',
              complexity: configData.complexity || 'Intermediate',
              wordCount: configData.wordCount || 5000,
              wordDistribution: configData.wordDistribution || 'balanced',
              wordEnforcement: configData.wordEnforcement || 'flexible',
              goal: configData.goal || 'Teaching',
              culturalIntegration: configData.culturalIntegration || 'Moderate',
              terminology: configData.terminology || 'Standard',
              markers: configData.markers || 'Standard',
              standards: configData.standards || [],
              customStandards: configData.customStandards || [],
              structure: configData.structure || 'Default',
              formatting: configData.formatting || 'Default',
              interfaceLanguage: configData.interfaceLanguage || 'English',
              experienceLevel: configData.experienceLevel || 'Intermediate',
              interactionMode: configData.interactionMode || 'Guided',
              outputDetail: configData.outputDetail || 'Detailed',
              systemBehavior: configData.systemBehavior || 'Balanced',
              lastModified: configData.updated_at || new Date().toISOString()
            }));
          } else {
            console.log('No existing configuration found, using project defaults');
          }
        }
      } catch (error: any) {
        console.error('Error loading project:', error);
        toast({
          title: 'Error loading project',
          description: 'Failed to load project data',
          variant: 'destructive'
        });
        setSaveError(`Error loading project: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectAndConfig();
  }, [projectId, toast]);

  return {
    isLoading,
    saveError,
    project,
    configData,
    updateConfigData,
    handleSaveChanges,
    setSaveError
  };
}
