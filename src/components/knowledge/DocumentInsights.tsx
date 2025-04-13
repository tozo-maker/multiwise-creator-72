
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DocumentInsightService, DocumentInsight } from '@/services/DocumentInsightService';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, BarChart2, Languages, FileType2, Scale, Award, RefreshCw, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DocumentReAnalysisButton } from './DocumentReAnalysisButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export interface AnalysisGoal {
  id: string;
  name: string;
  description: string;
}

export interface DocumentInsightsProps {
  fileId?: string;
  projectId?: string;
  insight?: DocumentInsight | null;
  isLoading?: boolean;
  fileName?: string;
  onProcessDocument?: () => Promise<void>;
}

const ANALYSIS_GOALS: AnalysisGoal[] = [
  { id: 'standard', name: 'Standard Analysis', description: 'General insights including summary, key concepts, and complexity level' },
  { id: 'terminology', name: 'Terminology Extraction', description: 'Identify and extract key terminology and domain-specific vocabulary' },
  { id: 'educational', name: 'Educational Analysis', description: 'Analyze content structure and pedagogical elements for educational materials' },
  { id: 'sentiment', name: 'Sentiment Analysis', description: 'Detailed emotional tone analysis and content sentiment mapping' },
  { id: 'comprehensive', name: 'Comprehensive Analysis', description: 'In-depth analysis combining all aspects (takes longer)' }
];

export const DocumentInsights: React.FC<DocumentInsightsProps> = ({
  fileId,
  projectId,
  insight: providedInsight,
  isLoading: providedIsLoading,
  fileName,
  onProcessDocument
}) => {
  const [insights, setInsights] = useState<DocumentInsight | null>(providedInsight || null);
  const [isLoading, setIsLoading] = useState(providedIsLoading || false);
  const [analysisGoalDialogOpen, setAnalysisGoalDialogOpen] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['standard']);
  const { toast } = useToast();

  // Load insights if not provided and fileId exists
  const loadInsights = async () => {
    if (!fileId || providedInsight) return;
    
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
    if (providedInsight) {
      setInsights(providedInsight);
    } else {
      loadInsights();
    }
  }, [fileId, providedInsight]);

  // Handle insight refresh
  const handleRefresh = () => {
    if (onProcessDocument) {
      onProcessDocument();
    } else {
      loadInsights();
    }
  };

  // Process document with selected goals
  const processWithSelectedGoals = async () => {
    if (!fileId || !projectId) return;
    
    setAnalysisGoalDialogOpen(false);
    setIsLoading(true);
    
    try {
      const analysisType = selectedGoals.join(',');
      const result = await DocumentInsightService.processDocument(fileId, projectId, {
        analysisType,
        forceReAnalysis: true
      });
      
      setInsights(result);
      toast({
        title: "Analysis Complete",
        description: "Document analysis completed with selected goals",
      });
    } catch (error) {
      console.error("Error processing document with goals:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to complete the requested analysis",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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

  // If we don't have a fileId and no insight was provided, render nothing
  if (!fileId && !providedInsight) return null;

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
              <div className="flex flex-col gap-2">
                {fileId && projectId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setAnalysisGoalDialogOpen(true)}
                    className="gap-2 w-full"
                  >
                    <Settings className="h-4 w-4" />
                    Custom Analysis
                  </Button>
                )}
                
                {fileId && projectId && (
                  <DocumentReAnalysisButton 
                    fileId={fileId} 
                    projectId={projectId}
                    onAnalysisComplete={handleRefresh}
                  />
                )}
                
                {onProcessDocument && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onProcessDocument}
                    className="gap-2 w-full"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Analyze Document
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Document Insights</h3>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setAnalysisGoalDialogOpen(true)}
                    title="Custom Analysis"
                    className="h-7 w-7"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </Button>
                  
                  {fileId && projectId && (
                    <DocumentReAnalysisButton 
                      fileId={fileId} 
                      projectId={projectId}
                      onAnalysisComplete={handleRefresh}
                      variant="icon"
                    />
                  )}
                  
                  {onProcessDocument && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={onProcessDocument}
                      title="Re-analyze"
                      className="h-7 w-7"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
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
                
                {insights.analysis_type && (
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-slate-500" />
                    <div>
                      <div className="text-xs text-slate-500">Analysis Type</div>
                      <div className="text-sm font-medium capitalize">
                        {insights.analysis_type.includes(',') 
                          ? 'Custom' 
                          : insights.analysis_type}
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
                    {(typeof insights.key_concepts === 'object' && Array.isArray(insights.key_concepts)) 
                      ? insights.key_concepts.map((concept: string | any, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {typeof concept === 'string' ? concept : concept.concept || concept.term || JSON.stringify(concept)}
                          </Badge>
                        ))
                      : <span className="text-xs text-slate-500">No concepts available</span>
                    }
                  </div>
                </div>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
      
      {/* Analysis Goals Dialog */}
      <Dialog open={analysisGoalDialogOpen} onOpenChange={setAnalysisGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Custom Document Analysis</DialogTitle>
            <DialogDescription>
              Select analysis goals for {fileName || "this document"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              {ANALYSIS_GOALS.map((goal) => (
                <div key={goal.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`goal-${goal.id}`}
                    checked={selectedGoals.includes(goal.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedGoals(prev => [...prev, goal.id]);
                      } else {
                        setSelectedGoals(prev => prev.filter(g => g !== goal.id));
                      }
                    }}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={`goal-${goal.id}`} className="font-medium">
                      {goal.name}
                    </Label>
                    <p className="text-sm text-slate-500">
                      {goal.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAnalysisGoalDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={processWithSelectedGoals}
              disabled={selectedGoals.length === 0}
            >
              Analyze Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
