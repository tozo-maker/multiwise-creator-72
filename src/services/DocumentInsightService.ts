
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
}

export const DocumentInsightService = {
  async getByFileId(fileId: string): Promise<DocumentInsight | null> {
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
      
      return data;
    } catch (error) {
      console.error('Error fetching document insight:', error);
      toast({
        title: 'Error',
        description: 'Failed to load document insight',
        variant: 'destructive',
      });
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
      toast({
        title: 'Error',
        description: 'Failed to load document insights',
        variant: 'destructive',
      });
      return [];
    }
  },
  
  async processDocument(fileId: string, projectId: string, options?: {
    analysisType?: string;
    forceReAnalysis?: boolean;
  }): Promise<DocumentInsight> {
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
      
      // Get the file details to extract the URL
      const { data: fileData, error: fileError } = await supabase
        .from('knowledge_base_files')
        .select('url, name')
        .eq('id', fileId)
        .single();
        
      if (fileError) {
        console.error('Error fetching file details:', fileError);
        throw new Error('Unable to find the file for analysis');
      }
      
      // Prepare for analysis by creating a pending insight
      const { data: pendingInsight, error: pendingError } = await supabase
        .from('document_insights')
        .insert({
          file_id: fileId,
          project_id: projectId, 
          title: fileData.name,
          status: 'pending',
          analysis_type: options?.analysisType || 'standard'
        })
        .select()
        .single();
        
      if (pendingError) {
        console.error('Error creating pending insight:', pendingError);
        throw pendingError;
      }
      
      // Call the analyze function (typically an edge function)
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: {
          fileId,
          projectId,
          fileUrl: fileData.url,
          fileName: fileData.name,
          analysisType: options?.analysisType || 'standard'
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
      
      return finalInsight;
    } catch (error) {
      console.error('Error processing document:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to process the document',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  async getAnalysisTypes(): Promise<string[]> {
    // This would be expanded with actual analysis types
    return [
      'standard',
      'in-depth',
      'educational',
      'terminology',
      'sentiment'
    ];
  }
};
