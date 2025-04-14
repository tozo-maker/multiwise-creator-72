
import { supabase } from '@/integrations/supabase/client';
import type { ProcessDocumentOptions } from './types';
import { cacheService } from '@/services/CacheService';

export const DocumentProcessor = {
  /**
   * Process a document to generate insights
   */
  async processDocument(fileId: string, projectId: string, options: ProcessDocumentOptions = {}) {
    try {
      // Call the edge function to process the document
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: {
          fileId,
          projectId,
          forceReAnalysis: options.forceReAnalysis || false,
          analysisType: options.analysisType || ['key_concepts', 'summary', 'complexity']
        }
      });
      
      if (error) {
        console.error('Error invoking process-document function:', error);
        throw new Error(error.message || 'Failed to process document');
      }
      
      // Invalidate related caches
      cacheService.invalidateTag(`file_${fileId}`);
      cacheService.invalidateTag(`project_${projectId}`);
      
      return data;
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  },
  
  /**
   * Update relationships between documents
   */
  async updateRelationships(fileId: string, relatedIds: string[], projectId: string) {
    try {
      // We're just mocking this for now
      console.log(`Updating relationships for file ${fileId} in project ${projectId}:`, relatedIds);
      
      // In a real implementation, you would update a relationships table in the database
      
      // Invalidate related caches
      cacheService.invalidateTag(`file_${fileId}`);
      cacheService.invalidateTag(`project_${projectId}`);
      cacheService.invalidateTag(`file_${fileId}_related`);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating relationships:', error);
      throw error;
    }
  },
  
  /**
   * Get available analysis types
   */
  async getAnalysisTypes() {
    const cacheKey = 'document_analysis_types';
    
    try {
      return await cacheService.getOrSet(
        cacheKey,
        async () => {
          // In a real implementation, this might come from an API or config
          return [
            { id: 'key_concepts', name: 'Key Concepts', description: 'Extract key concepts and terminology' },
            { id: 'summary', name: 'Summary', description: 'Generate a concise summary of the document' },
            { id: 'complexity', name: 'Complexity Analysis', description: 'Determine reading level and complexity' },
            { id: 'sentiment', name: 'Sentiment Analysis', description: 'Analyze sentiment and tone' },
            { id: 'language', name: 'Language Detection', description: 'Detect primary language of the document' }
          ];
        },
        { ttl: 24 * 60 * 60 * 1000 } // Cache for 24 hours
      );
    } catch (error) {
      console.error('Error getting analysis types:', error);
      throw error;
    }
  }
};
