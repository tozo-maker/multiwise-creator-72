
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
