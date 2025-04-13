
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentProcessorOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useDocumentProcessor(options: DocumentProcessorOptions = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const processDocument = async (fileId: string, projectId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to process documents',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: {
          fileId,
          projectId,
          userId: user.id,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to process document');
      }

      setProcessedData(data);
      
      toast({
        title: 'Document Processed',
        description: 'The document was successfully analyzed',
      });
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
      
      return data;
    } catch (error) {
      console.error('Error processing document:', error);
      
      toast({
        title: 'Processing Error',
        description: error.message || 'Failed to process the document',
        variant: 'destructive',
      });
      
      if (options.onError) {
        options.onError(error);
      }
      
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processDocument,
    isProcessing,
    processedData,
  };
}
