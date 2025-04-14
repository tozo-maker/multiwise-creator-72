
import { supabase } from '@/integrations/supabase/client';
import { DocumentInsight } from './types';

export const DocumentInsightQuery = {
  /**
   * Get document insight by file ID
   */
  async getByFileId(fileId: string): Promise<DocumentInsight | null> {
    try {
      const { data, error } = await supabase
        .from('document_insights')
        .select('*')
        .eq('file_id', fileId)
        .single();
        
      if (error) {
        console.error('Error getting document insight by file ID:', error);
        return null;
      }
      
      return data as DocumentInsight;
    } catch (error) {
      console.error('Error in getByFileId:', error);
      return null;
    }
  },
  
  /**
   * Get document insights by project ID
   */
  async getByProjectId(projectId: string): Promise<DocumentInsight[]> {
    try {
      const { data, error } = await supabase
        .from('document_insights')
        .select('*')
        .eq('project_id', projectId);
        
      if (error) {
        console.error('Error getting document insights by project ID:', error);
        return [];
      }
      
      return data as DocumentInsight[];
    } catch (error) {
      console.error('Error in getByProjectId:', error);
      return [];
    }
  }
};
