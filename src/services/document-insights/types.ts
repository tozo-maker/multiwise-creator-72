
/**
 * Document Insight interface representing the analysis results
 */
export interface DocumentInsight {
  id: string;
  file_id: string;
  project_id: string;
  title: string;
  summary?: string;
  key_concepts?: Array<string | { concept: string; relevance: number }>;
  sentiment_score?: number;
  complexity_level?: string;
  language_detected?: string;
  related_files?: string[];
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow for additional properties from comprehensive analysis
}

/**
 * Options for document processing
 */
export interface ProcessDocumentOptions {
  forceReAnalysis?: boolean;
  analysisType?: string | string[];
}
