
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useTableExists() {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Checks if a table exists in the Supabase database
   * @param tableName The name of the table to check
   * @returns A promise that resolves to a boolean indicating if the table exists
   */
  const checkTableExists = async (tableName: string): Promise<boolean> => {
    setIsChecking(true);
    setError(null);
    
    try {
      // First try direct query
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .limit(1);
        
      if (error) {
        // If we get a "relation does not exist" error, the table doesn't exist
        if (error.message.includes('does not exist') || error.code === '42P01') {
          return false;
        }
        
        // For other errors, we should throw
        throw error;
      }
      
      // If we got here with no error, the table exists
      return true;
      
    } catch (err: any) {
      // Don't treat "relation does not exist" errors as errors
      if (err.message && (err.message.includes('does not exist') || err.code === '42P01')) {
        return false;
      }
      
      const error = err instanceof Error ? err : new Error('Unknown error checking table existence');
      setError(error);
      console.error('Error checking if table exists:', err);
      throw error;
    } finally {
      setIsChecking(false);
    }
  };
  
  return { 
    checkTableExists,
    isChecking,
    error
  };
}
