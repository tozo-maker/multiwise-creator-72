
import { supabase } from '@/integrations/supabase/client';
import { DocumentInsight, ProcessDocumentOptions } from './types';
import { DocumentInsightCache } from './cache';
import { DocumentInsightQuery } from './query';

export const DocumentProcessor = {
  async processDocument(fileId: string, projectId: string, options?: ProcessDocumentOptions): Promise<DocumentInsight> {
    try {
      // Check if we already have an insight and if it's recent (within last 24h)
      if (!options?.forceReAnalysis) {
        const existingInsight = await DocumentInsightQuery.getByFileId(fileId);
        
        if (existingInsight) {
          const insightDate = new Date(existingInsight.created_at);
          const now = new Date();
          const hoursSinceAnalysis = (now.getTime() - insightDate.getTime()) / (1000 * 60 * 60);
          
          // If analysis is less than 24 hours old, return existing insight
          if (hoursSinceAnalysis < 24) {
            return existingInsight;
          }
        }
      }
      
      // Performance optimization: Use a single query for file details
      const { data: fileData, error: fileError } = await supabase
        .from('knowledge_base_files')
        .select('url, name')
        .eq('id', fileId)
        .single();
        
      if (fileError) {
        console.error('Error fetching file details:', fileError);
        throw new Error('Unable to find the file for analysis');
      }
      
      // Create a pending insight (optimized to reduce processing time)
      const { data: pendingInsight, error: pendingError } = await supabase
        .from('document_insights')
        .insert({
          file_id: fileId,
          project_id: projectId, 
          title: fileData.name,
          status: 'pending',
          analysis_type: options?.analysisType || 'standard',
          related_files: options?.relatedFileIds || []
        })
        .select()
        .single();
        
      if (pendingError) {
        console.error('Error creating pending insight:', pendingError);
        throw pendingError;
      }
      
      // Background processing via edge function (optimized with response streaming)
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: {
          fileId,
          projectId,
          fileUrl: fileData.url,
          fileName: fileData.name,
          analysisType: options?.analysisType || 'standard',
          relatedFileIds: options?.relatedFileIds || []
        }
      });
      
      if (error) {
        console.error('Error processing document:', error);
        
        // Update insight status to failed
        await supabase
          .from('document_insights')
          .update({ status: 'failed' })
          .eq('id', pendingInsight.id);
          
        throw error;
      }
      
      // Get the updated insight
      const { data: finalInsight, error: finalError } = await supabase
        .from('document_insights')
        .select('*')
        .eq('id', pendingInsight.id)
        .single();
        
      if (finalError) {
        console.error('Error fetching final insight:', finalError);
        throw finalError;
      }
      
      // Update cache with fresh data
      DocumentInsightCache.set(`insight:file:${fileId}`, finalInsight);
      
      return finalInsight;
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  },
  
  async updateRelationships(fileId: string, relatedFileIds: string[]): Promise<void> {
    try {
      const insight = await DocumentInsightQuery.getByFileId(fileId);
      
      if (!insight) {
        throw new Error('No insight found for this file');
      }
      
      // Update the related_files field
      const { error } = await supabase
        .from('document_insights')
        .update({ 
          related_files: relatedFileIds
        })
        .eq('id', insight.id);
        
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating document relationships:', error);
      throw error;
    }
  },
  
  async getAnalysisTypes(): Promise<string[]> {
    // Cache analysis types for better performance
    const cacheKey = 'analysis-types';
    const cached = DocumentInsightCache.get(cacheKey, 60 * 60 * 1000); // 1 hour cache
    
    if (cached) return cached;
    
    // This would be expanded with actual analysis types
    const types = [
      'standard',
      'terminology',
      'educational',
      'sentiment',
      'comprehensive'
    ];
    
    DocumentInsightCache.set(cacheKey, types);
    return types;
  }
};
