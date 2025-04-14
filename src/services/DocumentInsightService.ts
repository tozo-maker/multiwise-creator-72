
import { supabase } from '@/integrations/supabase/client';
import { DocumentInsight, ProcessDocumentOptions } from '@/services/document-insights/types';
import { DocumentProcessor } from '@/services/document-insights/processor';

/**
 * Service for managing document insights
 */
export const DocumentInsightService = {
  /**
   * Process a document to generate insights
   */
  async processDocument(fileId: string, projectId: string, options: ProcessDocumentOptions = {}) {
    return DocumentProcessor.processDocument(fileId, projectId, options);
  },
  
  /**
   * Get document insights for a specific file
   */
  async getInsightsForFile(fileId: string): Promise<DocumentInsight | null> {
    try {
      const { data, error } = await supabase
        .from('document_insights')
        .select('*')
        .eq('file_id', fileId)
        .single();
        
      if (error) {
        console.error('Error getting document insights:', error);
        return null;
      }
      
      return data as DocumentInsight;
    } catch (error) {
      console.error('Error in getInsightsForFile:', error);
      return null;
    }
  },
  
  /**
   * Update relationships between documents
   */
  async updateRelationships(fileId: string, relatedIds: string[], projectId: string) {
    return DocumentProcessor.updateRelationships(fileId, relatedIds, projectId);
  },
  
  /**
   * Get available analysis types
   */
  async getAnalysisTypes() {
    return DocumentProcessor.getAnalysisTypes();
  },
  
  /**
   * Get insights for multiple files in a project
   */
  async getInsightsForProject(projectId: string): Promise<DocumentInsight[]> {
    try {
      const { data, error } = await supabase
        .from('document_insights')
        .select('*')
        .eq('project_id', projectId);
        
      if (error) {
        console.error('Error getting project document insights:', error);
        return [];
      }
      
      return data as DocumentInsight[];
    } catch (error) {
      console.error('Error in getInsightsForProject:', error);
      return [];
    }
  }
};

