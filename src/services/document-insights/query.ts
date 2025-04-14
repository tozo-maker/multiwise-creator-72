
import { supabase } from '@/integrations/supabase/client';
import { DocumentInsight } from './types';
import { DocumentInsightCache } from './cache';

export const DocumentInsightQuery = {
  async getByFileId(fileId: string): Promise<DocumentInsight | null> {
    const cacheKey = `insight:file:${fileId}`;
    const cached = DocumentInsightCache.get(cacheKey);
    
    if (cached) return cached;
    
    try {
      const { data, error } = await supabase
        .from('document_insights')
        .select('*')
        .eq('file_id', fileId)
        .order('created_at', { ascending: false })
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching document insight:', error);
        throw error;
      }
      
      // Cache the result
      if (data) DocumentInsightCache.set(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('Error fetching document insight:', error);
      return null;
    }
  },
  
  async getByProjectId(projectId: string): Promise<DocumentInsight[]> {
    try {
      const { data, error } = await supabase
        .from('document_insights')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching document insights for project:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching document insights for project:', error);
      return [];
    }
  },
  
  async getRelatedInsights(fileId: string): Promise<DocumentInsight[]> {
    try {
      // First get the current file's insights to find related files
      const mainInsight = await this.getByFileId(fileId);
      
      if (!mainInsight || !mainInsight.related_files || mainInsight.related_files.length === 0) {
        return [];
      }
      
      // Fetch insights for related files
      const { data, error } = await supabase
        .from('document_insights')
        .select('*')
        .in('file_id', mainInsight.related_files)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching related document insights:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching related document insights:', error);
      return [];
    }
  }
};
