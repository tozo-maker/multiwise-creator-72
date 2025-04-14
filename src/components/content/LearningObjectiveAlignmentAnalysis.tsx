
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ContentAnalysisService, LearningObjectiveAlignment } from '@/services/ContentAnalysisService';
import { BarChart, Target, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';

interface LearningObjectiveAlignmentAnalysisProps {
  content: string;
  contentId: string;
  projectId: string;
  learningObjectives: Array<{ id: string; text: string }>;
  onUpdateContent?: (content: string) => void;
}

export const LearningObjectiveAlignmentAnalysis: React.FC<LearningObjectiveAlignmentAnalysisProps> = ({
  content,
  contentId,
  projectId,
  learningObjectives,
  onUpdateContent
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [alignmentResults, setAlignmentResults] = useState<LearningObjectiveAlignment[]>([]);
  const [openObjective, setOpenObjective] = useState<string | null>(null);
  
  const toggleObjective = (id: string) => {
    setOpenObjective(openObjective === id ? null : id);
  };
  
  const runAlignmentAnalysis = async () => {
    if (!content.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please add some content before running the analysis.',
        variant: 'destructive'
      });
      return;
    }
    
    if (learningObjectives.length === 0) {
      toast({
        title: 'Learning Objectives Required',
        description: 'Please add at least one learning objective to analyze alignment.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const results = await ContentAnalysisService.analyzeLearningObjectiveAlignment(
        content,
        learningObjectives,
        projectId
      );
      
      setAlignmentResults(results);
      
      // Save analysis results to database
      await ContentAnalysisService.saveAnalysisResults(
        contentId,
        projectId,
        'learning_objective_alignment',
        results
      );
      
      toast({
        title: 'Analysis Complete',
        description: 'Learning objective alignment analysis has been completed.'
      });
      
      // Open the first objective with a low alignment score if any
      const lowScoreObjective = results.find(r => r.alignmentScore < 70);
      if (lowScoreObjective) {
        setOpenObjective(lowScoreObjective.objectiveId);
      }
    } catch (error) {
      console.error('Error analyzing learning objective alignment:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze learning objective alignment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-600 dark:bg-green-500';
    if (score >= 60) return 'bg-yellow-600 dark:bg-yellow-500';
    return 'bg-red-600 dark:bg-red-500';
  };
  
  const getBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };
  
  // Check if we have low alignment scores that need attention
  const hasLowAlignmentScores = alignmentResults.some(result => result.alignmentScore < 60);
  
  // Calculate average alignment score
  const averageAlignmentScore = alignmentResults.length 
    ? alignmentResults.reduce((sum, result) => sum + result.alignmentScore, 0) / alignmentResults.length 
    : 0;
  
  return (
    <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target size={18} />
          Learning Objective Alignment
        </CardTitle>
        <CardDescription>
          Analyze how well your content aligns with defined learning objectives
        </CardDescription>
      </CardHeader>
      
      {!alignmentResults.length && !isAnalyzing && (
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-full inline-flex items-center justify-center mb-4">
              <Target size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium">Learning Objective Alignment</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              {learningObjectives.length === 0 
                ? "Add learning objectives to your content to analyze alignment." 
                : "Run an analysis to evaluate how well your content aligns with your learning objectives."}
            </p>
            <Button 
              onClick={runAlignmentAnalysis}
              disabled={isAnalyzing || !content || learningObjectives.length === 0}
              className="mt-4"
            >
              Analyze Objective Alignment
            </Button>
          </div>
        </CardContent>
      )}
      
      {isAnalyzing && (
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <h3 className="text-lg font-medium">Analyzing Alignment</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Our AI is evaluating how well your content aligns with your learning objectives. This may take a few moments...
            </p>
          </div>
        </CardContent>
      )}
      
      {alignmentResults.length > 0 && !isAnalyzing && (
        <>
          <CardContent className="p-4">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Overall Alignment Score</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Average alignment across {alignmentResults.length} learning objectives
                </p>
              </div>
              <Badge className="text-lg" variant={getBadgeVariant(averageAlignmentScore)}>
                {Math.round(averageAlignmentScore)}/100
              </Badge>
            </div>
            
            {hasLowAlignmentScores && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Some learning objectives have low alignment scores. Review the gaps and implement the suggested improvements.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              {alignmentResults.map((result) => (
                <Collapsible 
                  key={result.objectiveId}
                  open={openObjective === result.objectiveId}
                  onOpenChange={() => toggleObjective(result.objectiveId)}
                  className={`border rounded-lg overflow-hidden ${
                    result.alignmentScore < 60 
                      ? 'border-red-300 dark:border-red-800' 
                      : result.alignmentScore < 80 
                        ? 'border-yellow-300 dark:border-yellow-800'
                        : 'border-green-300 dark:border-green-800'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{result.objectiveText}</h4>
                          <Badge variant={getBadgeVariant(result.alignmentScore)}>
                            {result.alignmentScore}/100
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <Progress 
                            value={result.alignmentScore} 
                            max={100}
                            className={getProgressColor(result.alignmentScore)} 
                          />
                        </div>
                      </div>
                      <CollapsibleTrigger className="ml-2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                        {openObjective === result.objectiveId ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  <CollapsibleContent>
                    <Separator />
                    <div className="p-4">
                      <div className="mb-3">
                        <h5 className="text-sm font-medium mb-1">Gap Analysis</h5>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{result.gapAnalysis}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-1">Improvement Suggestions</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          {result.improvementSuggestions.map((suggestion, idx) => (
                            <li key={idx} className="text-sm text-slate-600 dark:text-slate-300">{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="border-t px-6 py-4">
            <Button 
              onClick={runAlignmentAnalysis} 
              variant="outline" 
              className="mr-2"
              disabled={isAnalyzing}
            >
              <BarChart size={16} className="mr-2" />
              Run New Analysis
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
