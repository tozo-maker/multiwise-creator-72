
import { supabase } from '@/integrations/supabase/client';
import { ConfigData } from '@/components/wizard/types';

/**
 * Service for database utility functions
 */
export class DatabaseService {
  /**
   * Check if a table exists in the database
   * @param tableName Name of the table to check
   * @returns Promise<boolean> indicating whether the table exists
   */
  static async tableExists(tableName: string): Promise<boolean> {
    try {
      // Try direct query
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .limit(1);
        
      if (error) {
        // If we get a "relation does not exist" error, the table doesn't exist
        if (error.message.includes('does not exist') || error.code === '42P01') {
          console.log(`Table '${tableName}' does not exist`);
          return false;
        }
        
        // For other errors we should log and throw
        console.error('Error checking if table exists:', error);
        throw error;
      }
      
      // If we got here with no error, the table exists
      console.log(`Table '${tableName}' exists`);
      return true;
    } catch (err: any) {
      // Don't treat "relation does not exist" errors as errors
      if (err.message && (err.message.includes('does not exist') || err.code === '42P01')) {
        console.log(`Table '${tableName}' does not exist (from catch)`);
        return false;
      }
      
      console.error('Error checking table existence:', err);
      throw err;
    }
  }

  /**
   * Check if a configuration exists for a project
   * @param projectId Project ID to check configuration for
   * @returns Promise<boolean> indicating whether configuration exists
   */
  static async projectConfigExists(projectId: string): Promise<boolean> {
    try {
      // First check if the table exists
      const tableExists = await this.tableExists('project_config');
      if (!tableExists) {
        console.log('project_config table does not exist');
        return false;
      }
      
      // Then check if there's a config for this project
      const { data, error } = await supabase
        .from('project_config')
        .select('id')
        .eq('project_id', projectId)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking project config:', error);
        throw error;
      }
      
      const exists = !!data;
      console.log(`Config for project ${projectId} exists: ${exists}`);
      return exists;
    } catch (err) {
      console.error('Error checking project config existence:', err);
      return false; // Return false on any error to be safe
    }
  }
  
  /**
   * Create or ensure the project_config table exists
   * @returns Promise<boolean> indicating success
   */
  static async ensureProjectConfigTableExists(): Promise<boolean> {
    try {
      const tableExists = await this.tableExists('project_config');
      
      if (!tableExists) {
        console.log('Creating project_config table using RPC function');
        const { error } = await supabase.rpc('create_project_config_table_if_not_exists');
        
        if (error) {
          console.error('Error creating project_config table:', error);
          throw error;
        }
        
        console.log('project_config table created successfully');
        return true;
      }
      
      console.log('project_config table already exists');
      return true;
    } catch (err) {
      console.error('Error ensuring project config table exists:', err);
      return false;
    }
  }
  
  /**
   * Get configuration for a project
   * @param projectId Project ID to get configuration for
   * @returns Promise with the configuration data
   */
  static async getProjectConfig(projectId: string): Promise<ConfigData | null> {
    try {
      // First check if the table exists
      const tableExists = await this.tableExists('project_config');
      if (!tableExists) {
        console.log('project_config table does not exist');
        return null;
      }
      
      // Then get the config for this project
      const { data, error } = await supabase
        .from('project_config')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();
        
      if (error) {
        console.error('Error getting project config:', error);
        throw error;
      }
      
      if (!data) {
        console.log('No configuration found for project', projectId);
        return null;
      }
      
      console.log('Got project config:', data);
      
      // Convert database structure to ConfigData structure
      const configData: ConfigData = {
        name: data.name || '',
        quickStart: 'custom',
        interfaceLanguage: data.interfaceLanguage || 'English',
        experienceLevel: data.experienceLevel || 'Intermediate',
        interactionMode: data.interactionMode || 'Guided',
        outputDetail: data.outputDetail || 'Detailed',
        systemBehavior: data.systemBehavior || 'Balanced',
        projectType: data.projectType || 'Textbook',
        customProjectType: data.customProjectType || '',
        subjects: data.subjects || [],
        levels: data.levels || [],
        pedagogy: data.pedagogy || 'Standard',
        customPedagogy: data.customPedagogy || '',
        wordCount: data.wordCount || 5000,
        wordDistribution: data.wordDistribution || 'balanced',
        wordEnforcement: data.wordEnforcement || 'flexible',
        targetLanguage: data.targetLanguage || 'English',
        goal: data.goal || 'Teaching',
        complexity: data.complexity || 'Intermediate',
        culturalIntegration: data.culturalIntegration || 'Standard',
        terminology: data.terminology || 'Standard',
        markers: data.markers || 'Standard',
        standards: data.standards || [],
        customStandards: data.customStandards || [],
        structure: data.structure || 'Default',
        formatting: data.formatting || 'Default',
        scriptType: data.scriptType || 'Latin',
        uploadedDocuments: [],
        needsDocumentUpload: false,
        projectId: projectId,
        createdDate: data.created_at || new Date().toISOString(),
        lastModified: data.updated_at || new Date().toISOString()
      };
      
      return configData;
    } catch (err) {
      console.error('Error getting project config:', err);
      return null;
    }
  }
  
  /**
   * Save configuration for a project
   * @param projectId Project ID to save configuration for
   * @param configData Configuration data to save
   * @returns Promise<boolean> indicating success
   */
  static async saveProjectConfig(projectId: string, configData: Partial<ConfigData>): Promise<boolean> {
    try {
      console.log('Saving project configuration:', projectId, configData);
      
      // Ensure the table exists
      await this.ensureProjectConfigTableExists();
      
      // Check if config exists for this project
      const configExists = await this.projectConfigExists(projectId);
      
      // Extract all relevant data from configData
      const configToSave = {
        project_id: projectId,
        name: configData.name,
        projectType: configData.projectType,
        customProjectType: configData.customProjectType,
        targetLanguage: configData.targetLanguage,
        subjects: configData.subjects,
        levels: configData.levels,
        pedagogy: configData.pedagogy,
        customPedagogy: configData.customPedagogy,
        complexity: configData.complexity,
        wordCount: configData.wordCount,
        wordDistribution: configData.wordDistribution,
        wordEnforcement: configData.wordEnforcement,
        goal: configData.goal,
        culturalIntegration: configData.culturalIntegration,
        terminology: configData.terminology,
        markers: configData.markers,
        standards: configData.standards,
        customStandards: configData.customStandards,
        structure: configData.structure,
        formatting: configData.formatting,
        scriptType: configData.scriptType,
        interfaceLanguage: configData.interfaceLanguage,
        experienceLevel: configData.experienceLevel,
        interactionMode: configData.interactionMode,
        outputDetail: configData.outputDetail,
        systemBehavior: configData.systemBehavior,
        updated_at: new Date().toISOString(),
      };
      
      let result;
      
      if (configExists) {
        // Update existing config
        console.log('Updating existing config for project:', projectId);
        const { data, error } = await supabase
          .from('project_config')
          .update(configToSave)
          .eq('project_id', projectId)
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
      return true;
      
    } catch (error: any) {
      console.error('Error saving configuration:', error);
      return false;
    }
  }
}
