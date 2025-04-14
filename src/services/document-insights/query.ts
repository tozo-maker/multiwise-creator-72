
import { supabase } from '@/integrations/supabase/client';
import type { DocumentInsight } from './types';
import { cacheService } from '@/services/CacheService';

export const DocumentInsightQuery = {
  /**
   * Get document insights by file ID with enhanced caching
   */
  async getByFileId(fileId: string): Promise<DocumentInsight | null> {
    const cacheKey = `document_insight_${fileId}`;
    
    try {
      return await cacheService.getOrSet<DocumentInsight | null>(
        cacheKey,
        async () => {
          const { data, error } = await supabase
            .from('document_insights')
            .select('*')
            .eq('file_id', fileId)
            .single();
            
          if (error) {
            console.error('Error fetching document insight:', error);
            return null;
          }
          
          return data as DocumentInsight;
        },
        { ttl: 10 * 60 * 1000, tags: ['document_insights', `file_${fileId}`] }
      );
    } catch (error) {
      console.error('Error in getByFileId:', error);
      return null;
    }
  },
  
  /**
   * Get document insights by project ID with enhanced caching
   */
  async getByProjectId(projectId: string): Promise<DocumentInsight[]> {
    const cacheKey = `document_insights_project_${projectId}`;
    
    try {
      return await cacheService.getOrSet<DocumentInsight[]>(
        cacheKey,
        async () => {
          const { data, error } = await supabase
            .from('document_insights')
            .select('*')
            .eq('project_id', projectId);
            
          if (error) {
            console.error('Error fetching document insights by project:', error);
            return [];
          }
          
          return data as DocumentInsight[];
        },
        { ttl: 5 * 60 * 1000, tags: ['document_insights', `project_${projectId}`] }
      );
    } catch (error) {
      console.error('Error in getByProjectId:', error);
      return [];
    }
  },
  
  /**
   * Get related document insights based on key concepts with enhanced caching
   */
  async getRelatedInsights(fileId: string, limit: number = 5): Promise<DocumentInsight[]> {
    const cacheKey = `document_related_insights_${fileId}_${limit}`;
    
    try {
      return await cacheService.getOrSet<DocumentInsight[]>(
        cacheKey,
        async () => {
          // First get the current document's insights
          const currentInsight = await this.getByFileId(fileId);
          
          if (!currentInsight || !currentInsight.key_concepts) {
            return [];
          }
          
          // Get all insights for similarity comparison
          const { data, error } = await supabase
            .from('document_insights')
            .select('*')
            .neq('file_id', fileId);
            
          if (error) {
            console.error('Error fetching related insights:', error);
            return [];
          }
          
          const insights = data as DocumentInsight[];
          if (!insights.length) return [];
          
          // Calculate similarity scores based on key concepts
          const scoredInsights = insights.map(insight => {
            if (!insight.key_concepts) return { ...insight, similarity: 0 };
            
            // Calculate Jaccard similarity between key concepts
            const currentConcepts = new Set(currentInsight.key_concepts.map((c: any) => 
              typeof c === 'string' ? c : c.concept || c.term || ''));
            const otherConcepts = new Set(insight.key_concepts.map((c: any) => 
              typeof c === 'string' ? c : c.concept || c.term || ''));
            
            // Intersection size
            const intersection = [...currentConcepts].filter(concept => otherConcepts.has(concept));
            
            // Union size
            const union = new Set([...currentConcepts, ...otherConcepts]);
            
            // Calculate Jaccard similarity coefficient
            const similarity = union.size === 0 ? 0 : intersection.length / union.size;
            
            return { ...insight, similarity };
          });
          
          // Sort by similarity score and take the top `limit`
          return scoredInsights
            .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
            .slice(0, limit);
        },
        { ttl: 15 * 60 * 1000, tags: ['document_insights', `file_${fileId}_related`] }
      );
    } catch (error) {
      console.error('Error in getRelatedInsights:', error);
      return [];
    }
  }
};
