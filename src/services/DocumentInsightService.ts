
import { supabase } from '@/integrations/supabase/client';

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
}

export const DocumentInsightService = {
  async getByFileId(fileId: string): Promise<DocumentInsight | null> {
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
  },
  
  async getByProjectId(projectId: string): Promise<DocumentInsight[]> {
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
  },
  
  async processDocument(fileId: string, projectId: string): Promise<DocumentInsight> {
    const { data, error } = await supabase.functions.invoke('process-document', {
      body: {
        fileId,
        projectId,
      }
    });
    
    if (error) {
      console.error('Error processing document:', error);
      throw error;
    }
    
    return data.insights;
  }
};
