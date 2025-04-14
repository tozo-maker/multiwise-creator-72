
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DocumentInsight {
  id: string;
  project_id: string;
  file_id: string;
  title: string;
  summary?: string;
  key_concepts?: any[];
  sentiment_score?: number;
  complexity_level?: string;
  language_detected?: string;
  created_at: string;
  updated_at?: string;
  analysis_type?: string;
  status?: string;
  related_files?: string[];
}

export interface ProcessDocumentOptions {
  analysisType?: string;
  forceReAnalysis?: boolean;
  relatedFileIds?: string[];
}

// Simple cache implementation for document insights
const insightCache = new Map<string, {
  data: any;
  timestamp: number;
}>();

export const DocumentInsightService = {
  // Cache control function
  _getFromCache(key: string, maxAge: number = 5 * 60 * 1000): any {
    const cached = insightCache.get(key);
    if (cached && (Date.now() - cached.timestamp) < maxAge) {
      console.log(`Cache hit for ${key}`);
      return cached.data;
    }
    console.log(`Cache miss for ${key}`);
    return null;
  },
  
  _setCache(key: string, data: any): void {
    insightCache.set(key, {
      data,
      timestamp: Date.now()
    });
  },
  
  async getByFileId(fileId: string): Promise<DocumentInsight | null> {
    const cacheKey = `insight:file:${fileId}`;
    const cached = this._getFromCache(cacheKey);
    
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
      if (data) this._setCache(cacheKey, data);
      
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
  },
  
  async processDocument(fileId: string, projectId: string, options?: ProcessDocumentOptions): Promise<DocumentInsight> {
    try {
      // Check if we already have an insight and if it's recent (within last 24h)
      if (!options?.forceReAnalysis) {
        const existingInsight = await this.getByFileId(fileId);
        
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
      this._setCache(`insight:file:${fileId}`, finalInsight);
      
      return finalInsight;
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  },
  
  async updateRelationships(fileId: string, relatedFileIds: string[]): Promise<void> {
    try {
      const insight = await this.getByFileId(fileId);
      
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
    const cached = this._getFromCache(cacheKey, 60 * 60 * 1000); // 1 hour cache
    
    if (cached) return cached;
    
    // This would be expanded with actual analysis types
    const types = [
      'standard',
      'terminology',
      'educational',
      'sentiment',
      'comprehensive'
    ];
    
    this._setCache(cacheKey, types);
    return types;
  },
  
  // Method to clear caches (useful for testing or when data is known to be stale)
  clearCache(fileId?: string): void {
    if (fileId) {
      insightCache.delete(`insight:file:${fileId}`);
    } else {
      insightCache.clear();
    }
  }
};
