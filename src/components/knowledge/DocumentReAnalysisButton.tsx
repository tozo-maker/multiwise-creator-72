
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { DocumentInsightService } from '@/services/DocumentInsightService';
import { useToast } from '@/hooks/use-toast';

interface DocumentReAnalysisButtonProps {
  fileId: string;
  projectId: string;
  onAnalysisComplete?: (data?: any) => void;
  variant?: 'default' | 'outline' | 'icon';
  size?: 'default' | 'sm';
  className?: string;
}

export const DocumentReAnalysisButton: React.FC<DocumentReAnalysisButtonProps> = ({
  fileId,
  projectId,
  onAnalysisComplete,
  variant = 'outline',
  size = 'sm',
  className = ''
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleReAnalyze = async () => {
    setIsProcessing(true);
    
    try {
      const result = await DocumentInsightService.processDocument(fileId, projectId, {
        forceReAnalysis: true
      });
      
      toast({
        title: "Analysis Complete",
        description: "Document has been successfully re-analyzed"
      });
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error("Error re-analyzing document:", error);
      
      toast({
        title: "Analysis Failed",
        description: "Failed to re-analyze the document",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleReAnalyze}
        disabled={isProcessing}
        title="Re-analyze document"
        className={`h-7 w-7 ${className}`}
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleReAnalyze}
      disabled={isProcessing}
      className={`gap-2 ${className}`}
    >
      <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
      {isProcessing ? 'Analyzing...' : 'Re-analyze Document'}
    </Button>
  );
};
