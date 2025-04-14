
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ContentAnalysisService, ContentQualityMetrics } from '@/services/ContentAnalysisService';
import { BookOpen, CheckCircle, AlertTriangle, RefreshCw, Info } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';

interface ContentQualityAnalysisProps {
  content: string;
  contentId: string;
  projectId: string;
  contentType: string;
  onUpdateContent?: (content: string) => void;
}

export const ContentQualityAnalysis: React.FC<ContentQualityAnalysisProps> = ({
  content,
  contentId,
  projectId,
  contentType,
  onUpdateContent
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [qualityMetrics, setQualityMetrics] = useState<ContentQualityMetrics | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const runQualityAnalysis = async () => {
    if (!content.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please add some content before running the analysis.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const results = await ContentAnalysisService.analyzeContentQuality(
        content,
        contentType,
        projectId
      );
      
      setQualityMetrics(results);
      
      // Save analysis results to database
      await ContentAnalysisService.saveAnalysisResults(
        contentId,
        projectId,
        'quality_assessment',
        results
      );
      
      toast({
        title: 'Analysis Complete',
        description: 'Content quality analysis has been completed.'
      });
    } catch (error) {
      console.error('Error analyzing content quality:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze content quality. Please try again.',
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
  
  return (
    <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen size={18} />
          Content Quality Analysis
        </CardTitle>
        <CardDescription>
          Analyze your content quality with AI to identify strengths and areas for improvement
        </CardDescription>
      </CardHeader>
      
      {!qualityMetrics && !isAnalyzing && (
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full inline-flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium">Content Quality Analysis</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Run an analysis to evaluate readability, accessibility, alignment with learning objectives, and get actionable improvement suggestions.
            </p>
            <Button 
              onClick={runQualityAnalysis}
              disabled={isAnalyzing || !content}
              className="mt-4"
            >
              Analyze Content Quality
            </Button>
          </div>
        </CardContent>
      )}
      
      {isAnalyzing && (
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <h3 className="text-lg font-medium">Analyzing Content</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Our AI is evaluating your content across multiple dimensions. This may take a few moments...
            </p>
          </div>
        </CardContent>
      )}
      
      {qualityMetrics && !isAnalyzing && (
        <>
          <CardContent className="p-4">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="strengths">Strengths</TabsTrigger>
                <TabsTrigger value="improvements">Improvements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Overall Quality Score</h3>
                    <Badge className="text-lg" variant={qualityMetrics.overallScore >= 70 ? "default" : "destructive"}>
                      {qualityMetrics.overallScore}/100
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Readability</span>
                        <span className={getScoreColor(qualityMetrics.readabilityScore)}>
                          {qualityMetrics.readabilityScore}/100
                        </span>
                      </div>
                      <Progress 
                        value={qualityMetrics.readabilityScore} 
                        max={100} 
                        className={getProgressColor(qualityMetrics.readabilityScore)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Engagement</span>
                        <span className={getScoreColor(qualityMetrics.engagementScore)}>
                          {qualityMetrics.engagementScore}/100
                        </span>
                      </div>
                      <Progress 
                        value={qualityMetrics.engagementScore} 
                        max={100} 
                        className={getProgressColor(qualityMetrics.engagementScore)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Learning Alignment</span>
                        <span className={getScoreColor(qualityMetrics.alignmentScore)}>
                          {qualityMetrics.alignmentScore}/100
                        </span>
                      </div>
                      <Progress 
                        value={qualityMetrics.alignmentScore} 
                        max={100} 
                        className={getProgressColor(qualityMetrics.alignmentScore)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Accessibility</span>
                        <span className={getScoreColor(qualityMetrics.accessibilityScore)}>
                          {qualityMetrics.accessibilityScore}/100
                        </span>
                      </div>
                      <Progress 
                        value={qualityMetrics.accessibilityScore} 
                        max={100} 
                        className={getProgressColor(qualityMetrics.accessibilityScore)} 
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="strengths">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Content Strengths</h3>
                  
                  {qualityMetrics.strengths.length > 0 ? (
                    <div className="space-y-3">
                      {qualityMetrics.strengths.map((strength, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                          <CheckCircle className="text-green-600 dark:text-green-400 mt-0.5 h-5 w-5 flex-shrink-0" />
                          <p className="text-sm">{strength}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 text-slate-500 dark:text-slate-400">
                      No specific strengths identified.
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="improvements">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Suggested Improvements</h3>
                  
                  {qualityMetrics.improvements && qualityMetrics.improvements.length > 0 ? (
                    <div className="space-y-3">
                      {qualityMetrics.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                          <AlertTriangle className="text-yellow-600 dark:text-yellow-400 mt-0.5 h-5 w-5 flex-shrink-0" />
                          <p className="text-sm">{improvement}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 text-slate-500 dark:text-slate-400">
                      No specific improvements suggested.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Alert className="w-full">
              <Info className="w-4 h-4" />
              <AlertTitle>Analysis complete</AlertTitle>
              <AlertDescription>
                This analysis is based on AI evaluation and may require human review for accuracy.
              </AlertDescription>
            </Alert>
          </CardFooter>
          
          <CardFooter className="border-t px-6 py-4">
            <Button 
              onClick={runQualityAnalysis} 
              variant="outline" 
              className="mr-2"
              disabled={isAnalyzing}
            >
              <RefreshCw size={16} className="mr-2" />
              Run New Analysis
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
