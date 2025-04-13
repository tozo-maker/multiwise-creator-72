
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DocumentInsightService } from '@/services/DocumentInsightService';

interface DocumentReAnalysisButtonProps {
  fileId: string;
  projectId: string;
  onAnalysisComplete: () => void;
}

export const DocumentReAnalysisButton: React.FC<DocumentReAnalysisButtonProps> = ({
  fileId,
  projectId,
  onAnalysisComplete
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleReAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      
      toast({
        title: "Analysis started",
        description: "The document is being analyzed. This may take a moment.",
      });
      
      await DocumentInsightService.processDocument(fileId, projectId);
      
      toast({
        title: "Analysis complete",
        description: "The document has been successfully analyzed.",
      });
      
      onAnalysisComplete();
    } catch (error) {
      console.error('Error re-analyzing document:', error);
      toast({
        title: "Analysis failed",
        description: "Unable to analyze the document. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      disabled={isAnalyzing}
      onClick={handleReAnalyze}
      className="gap-2"
    >
      {isAnalyzing ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4" />
          Re-analyze
        </>
      )}
    </Button>
  );
};
