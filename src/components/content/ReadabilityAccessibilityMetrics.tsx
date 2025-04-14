
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ContentAnalysisService, ReadabilityMetrics, AccessibilityMetrics } from '@/services/ContentAnalysisService';
import { BookOpen, AlertTriangle, FileText, Eye, RefreshCw } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';

interface ReadabilityAccessibilityMetricsProps {
  content: string;
  contentId: string;
  projectId: string;
}

export const ReadabilityAccessibilityMetrics: React.FC<ReadabilityAccessibilityMetricsProps> = ({
  content,
  contentId,
  projectId
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('readability');
  const [readabilityMetrics, setReadabilityMetrics] = useState<ReadabilityMetrics | null>(null);
  const [accessibilityMetrics, setAccessibilityMetrics] = useState<AccessibilityMetrics | null>(null);
  
  const runReadabilityAnalysis = async () => {
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
      const results = await ContentAnalysisService.analyzeReadability(content, projectId);
      setReadabilityMetrics(results);
      
      // Save analysis results to database
      await ContentAnalysisService.saveAnalysisResults(
        contentId,
        projectId,
        'readability',
        results
      );
      
      toast({
        title: 'Analysis Complete',
        description: 'Readability metrics have been calculated.'
      });
    } catch (error) {
      console.error('Error analyzing readability:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze readability metrics. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const runAccessibilityAnalysis = async () => {
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
      const results = await ContentAnalysisService.analyzeAccessibility(content, projectId);
      setAccessibilityMetrics(results);
      
      // Save analysis results to database
      await ContentAnalysisService.saveAnalysisResults(
        contentId,
        projectId,
        'accessibility',
        results
      );
      
      toast({
        title: 'Analysis Complete',
        description: 'Accessibility metrics have been calculated.'
      });
    } catch (error) {
      console.error('Error analyzing accessibility:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze accessibility metrics. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const runAnalysis = async () => {
    if (activeTab === 'readability') {
      await runReadabilityAnalysis();
    } else {
      await runAccessibilityAnalysis();
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
  
  const getFleschKincaidDescription = (score: number) => {
    if (score >= 90) return 'Very Easy - 5th Grade';
    if (score >= 80) return 'Easy - 6th Grade';
    if (score >= 70) return 'Fairly Easy - 7th Grade';
    if (score >= 60) return 'Standard - 8th to 9th Grade';
    if (score >= 50) return 'Fairly Difficult - 10th to 12th Grade';
    if (score >= 30) return 'Difficult - College';
    return 'Very Difficult - College Graduate';
  };
  
  return (
    <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText size={18} />
          Readability & Accessibility Metrics
        </CardTitle>
        <CardDescription>
          Analyze readability and accessibility of your content
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="readability" className="flex items-center gap-2">
              <BookOpen size={14} />
              <span>Readability</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Eye size={14} />
              <span>Accessibility</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="readability">
            {isAnalyzing && activeTab === 'readability' ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="text-center space-y-4">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                  <h3 className="text-lg font-medium">Analyzing Readability</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md">
                    Calculating readability metrics for your content...
                  </p>
                </div>
              </div>
            ) : readabilityMetrics ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Flesch-Kincaid Readability Score</h3>
                    <Badge className={`${
                      readabilityMetrics.fleschKincaidScore >= 60 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {readabilityMetrics.fleschKincaidScore}
                    </Badge>
                  </div>
                  <Progress 
                    value={readabilityMetrics.fleschKincaidScore} 
                    max={100} 
                    className={getProgressColor(readabilityMetrics.fleschKincaidScore)} 
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {getFleschKincaidDescription(readabilityMetrics.fleschKincaidScore)}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Grade Level</p>
                    <p className="text-xl font-semibold">{readabilityMetrics.fleschKincaidGradeLevel}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Complex Words</p>
                    <p className="text-xl font-semibold">{readabilityMetrics.complexWordCount}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Avg. Sentence Length</p>
                    <p className="text-xl font-semibold">{readabilityMetrics.averageSentenceLength} words</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Avg. Word Length</p>
                    <p className="text-xl font-semibold">{readabilityMetrics.averageWordLength} chars</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Paragraph Structure</p>
                  <Badge className={`${
                    readabilityMetrics.paragraphStructure === 'excellent' || readabilityMetrics.paragraphStructure === 'good'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : readabilityMetrics.paragraphStructure === 'fair'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    <span className="capitalize">{readabilityMetrics.paragraphStructure}</span>
                  </Badge>
                </div>
                
                {readabilityMetrics.fleschKincaidScore < 60 && (
                  <Alert variant="warning" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your content may be too difficult for some readers. Consider simplifying language and shortening sentences.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="text-center space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full inline-flex items-center justify-center mb-4">
                    <BookOpen size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium">Readability Analysis</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md">
                    Analyze the readability of your content to ensure it's appropriate for your target audience.
                  </p>
                  <Button 
                    onClick={runReadabilityAnalysis}
                    disabled={isAnalyzing || !content}
                    className="mt-4"
                  >
                    Analyze Readability
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="accessibility">
            {isAnalyzing && activeTab === 'accessibility' ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="text-center space-y-4">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                  <h3 className="text-lg font-medium">Analyzing Accessibility</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md">
                    Evaluating accessibility features of your content...
                  </p>
                </div>
              </div>
            ) : accessibilityMetrics ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Overall Accessibility Rating</h3>
                    <Badge className={`${
                      accessibilityMetrics.overallRating >= 80 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : accessibilityMetrics.overallRating >= 60
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {accessibilityMetrics.overallRating}/100
                    </Badge>
                  </div>
                  <Progress 
                    value={accessibilityMetrics.overallRating} 
                    max={100} 
                    className={getProgressColor(accessibilityMetrics.overallRating)} 
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Screen Reader Friendliness</p>
                      <span className={getScoreColor(accessibilityMetrics.screenReaderFriendliness)}>
                        {accessibilityMetrics.screenReaderFriendliness}/100
                      </span>
                    </div>
                    <Progress 
                      value={accessibilityMetrics.screenReaderFriendliness} 
                      max={100} 
                      className={getProgressColor(accessibilityMetrics.screenReaderFriendliness)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Semantic Structure</p>
                      <span className={getScoreColor(accessibilityMetrics.semanticStructure)}>
                        {accessibilityMetrics.semanticStructure}/100
                      </span>
                    </div>
                    <Progress 
                      value={accessibilityMetrics.semanticStructure} 
                      max={100} 
                      className={getProgressColor(accessibilityMetrics.semanticStructure)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Keyboard Navigability</p>
                      <span className={getScoreColor(accessibilityMetrics.keyboardNavigability)}>
                        {accessibilityMetrics.keyboardNavigability}/100
                      </span>
                    </div>
                    <Progress 
                      value={accessibilityMetrics.keyboardNavigability} 
                      max={100} 
                      className={getProgressColor(accessibilityMetrics.keyboardNavigability)} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Color Contrast Compliance</p>
                    <Badge className={accessibilityMetrics.colorContrastCompliance ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}>
                      {accessibilityMetrics.colorContrastCompliance ? 'Compliant' : 'Non-compliant'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Media Alternatives</p>
                    <Badge className={accessibilityMetrics.mediaAlternatives ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}>
                      {accessibilityMetrics.mediaAlternatives ? 'Available' : 'Not Available'}
                    </Badge>
                  </div>
                </div>
                
                {accessibilityMetrics.improvementAreas && accessibilityMetrics.improvementAreas.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Improvement Areas</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {accessibilityMetrics.improvementAreas.map((area, index) => (
                        <li key={index} className="text-sm">{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {accessibilityMetrics.overallRating < 70 && (
                  <Alert variant="warning" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your content could be made more accessible. Consider addressing the improvement areas identified above.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="text-center space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-full inline-flex items-center justify-center mb-4">
                    <Eye size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium">Accessibility Analysis</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md">
                    Analyze the accessibility of your content to ensure it's usable by everyone, including people with disabilities.
                  </p>
                  <Button 
                    onClick={runAccessibilityAnalysis}
                    disabled={isAnalyzing || !content}
                    className="mt-4"
                  >
                    Analyze Accessibility
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {((activeTab === 'readability' && readabilityMetrics) || 
        (activeTab === 'accessibility' && accessibilityMetrics)) && (
        <CardFooter className="border-t px-6 py-4">
          <Button 
            onClick={runAnalysis} 
            variant="outline" 
            className="mr-2"
            disabled={isAnalyzing}
          >
            <RefreshCw size={16} className="mr-2" />
            Run New Analysis
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
