
import { DocumentProcessor } from './processor';
// Re-export the DocumentInsightService from the main service file
import { DocumentInsightService } from '@/services/DocumentInsightService';

export { DocumentProcessor, DocumentInsightService };
export type { DocumentInsight, ProcessDocumentOptions } from './types';
