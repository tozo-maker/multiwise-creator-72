
export interface DocumentInsight {
  id: string;
  file_id: string;
  project_id: string;
  content_summary?: string;
  key_concepts?: string[];
  language?: string;
  language_detected?: string;
  complexity_level?: string;
  sentiment_score?: number;
  analysis_type?: string;
  summary?: string;
  relationships?: Record<string, string[]>;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ProcessDocumentOptions {
  forceReprocess?: boolean;
  forceReAnalysis?: boolean; // Added this property to fix the processor.ts error
  analysisType?: string;
}

export interface DocumentRelationship {
  source_file_id: string;
  target_file_id: string;
  relationship_type?: string;
  strength?: number;
  metadata?: Record<string, any>;
}
