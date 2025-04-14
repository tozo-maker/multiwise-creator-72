
import { supabase } from '@/integrations/supabase/client';

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
  static async getProjectConfig(projectId: string): Promise<any | null> {
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
      
      console.log('Got project config:', data);
      return data;
    } catch (err) {
      console.error('Error getting project config:', err);
      return null;
    }
  }
}
