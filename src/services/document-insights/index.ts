
import { useToast } from '@/hooks/use-toast';
import { DocumentInsight, ProcessDocumentOptions } from './types';
import { DocumentInsightCache } from './cache';
import { DocumentInsightQuery } from './query';
import { DocumentProcessor } from './processor';

export { DocumentInsight, ProcessDocumentOptions };

// Main service that integrates all document insight functionality
export const DocumentInsightService = {
  // Query methods
  getByFileId: DocumentInsightQuery.getByFileId,
  getByProjectId: DocumentInsightQuery.getByProjectId,
  getRelatedInsights: DocumentInsightQuery.getRelatedInsights,
  
  // Processing methods
  processDocument: DocumentProcessor.processDocument,
  updateRelationships: DocumentProcessor.updateRelationships,
  getAnalysisTypes: DocumentProcessor.getAnalysisTypes,
  
  // Cache control
  clearCache: DocumentInsightCache.clear
};
