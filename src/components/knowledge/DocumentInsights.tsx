
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DocumentInsightService, DocumentInsight } from '@/services/DocumentInsightService';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, BarChart2, Languages, FileType2, Scale, Award, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DocumentReAnalysisButton } from './DocumentReAnalysisButton';

interface DocumentInsightsProps {
  fileId: string;
  projectId: string;
}

export const DocumentInsights: React.FC<DocumentInsightsProps> = ({
  fileId,
  projectId
}) => {
  const [insights, setInsights] = useState<DocumentInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load insights
  const loadInsights = async () => {
    try {
      setIsLoading(true);
      const data = await DocumentInsightService.getByFileId(fileId);
      setInsights(data);
    } catch (error) {
      console.error('Error fetching document insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [fileId]);

  // Handle insight refresh
  const handleRefresh = () => {
    loadInsights();
  };

  // Get sentiment label and color
  const getSentimentInfo = (score: number) => {
    if (score > 0.6) return { label: 'Positive', color: 'bg-green-100 text-green-800' };
    if (score > 0.4) return { label: 'Neutral', color: 'bg-slate-100 text-slate-800' };
    if (score > 0.2) return { label: 'Slightly Negative', color: 'bg-amber-100 text-amber-800' };
    return { label: 'Negative', color: 'bg-red-100 text-red-800' };
  };

  // Get complexity label and color
  const getComplexityInfo = (complexity: string) => {
    switch (complexity) {
      case 'beginner':
        return { label: 'Beginner', color: 'bg-green-100 text-green-800' };
      case 'intermediate':
        return { label: 'Intermediate', color: 'bg-blue-100 text-blue-800' };
      case 'advanced':
        return { label: 'Advanced', color: 'bg-purple-100 text-purple-800' };
      case 'expert':
        return { label: 'Expert', color: 'bg-red-100 text-red-800' };
      default:
        return { label: complexity || 'Unknown', color: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="mt-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            disabled={isLoading}
          >
            <BrainCircuit className="h-4 w-4 mr-2" />
            {isLoading ? 'Loading...' : 'Document Insights'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          {!insights ? (
            <div className="p-2">
              <p className="text-sm text-slate-500 mb-3">No insights available for this document.</p>
              <DocumentReAnalysisButton 
                fileId={fileId} 
                projectId={projectId}
                onAnalysisComplete={handleRefresh}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Document Insights</h3>
                <DocumentReAnalysisButton 
                  fileId={fileId} 
                  projectId={projectId}
                  onAnalysisComplete={handleRefresh}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {insights.language_detected && (
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-slate-500" />
                    <div>
                      <div className="text-xs text-slate-500">Language</div>
                      <div className="text-sm font-medium">
                        {insights.language_detected.toUpperCase()}
                      </div>
                    </div>
                  </div>
                )}
                
                {insights.complexity_level && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-slate-500" />
                    <div>
                      <div className="text-xs text-slate-500">Level</div>
                      <div className="text-sm">
                        <Badge className={`${getComplexityInfo(insights.complexity_level).color} border-0`}>
                          {getComplexityInfo(insights.complexity_level).label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
                
                {typeof insights.sentiment_score === 'number' && (
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-slate-500" />
                    <div>
                      <div className="text-xs text-slate-500">Sentiment</div>
                      <div className="text-sm">
                        <Badge className={`${getSentimentInfo(insights.sentiment_score).color} border-0`}>
                          {getSentimentInfo(insights.sentiment_score).label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {insights.summary && (
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Summary</div>
                  <p className="text-sm text-slate-700">{insights.summary}</p>
                </div>
              )}
              
              {insights.key_concepts && insights.key_concepts.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Key Concepts</div>
                  <div className="flex flex-wrap gap-1">
                    {insights.key_concepts.map((concept: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
