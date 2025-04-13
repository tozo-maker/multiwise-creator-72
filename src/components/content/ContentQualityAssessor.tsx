
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, BookOpen, CheckCircle, Brain, Lightbulb, RefreshCw } from 'lucide-react';
import { AnthropicService } from '@/services/AnthropicService';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/contexts/ThemeContext';

interface ContentQualityAssessorProps {
  content: string;
  contentType: string;
  projectId: string;
  learningObjectives?: string[];
  targetAudience?: string;
  onApplyEnhancement?: (enhancedContent: string) => void;
}

export const ContentQualityAssessor: React.FC<ContentQualityAssessorProps> = ({
  content,
  contentType,
  projectId,
  learningObjectives = [],
  targetAudience = '',
  onApplyEnhancement
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('quality');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [qualityMetrics, setQualityMetrics] = useState<any>(null);
  const [enhancedContent, setEnhancedContent] = useState<string>('');
  const [enhancementType, setEnhancementType] = useState<'clarity' | 'engagement' | 'alignment' | 'simplification' | 'elaboration'>('clarity');
  
  // Analyze content quality
  const analyzeContentQuality = async () => {
    if (!content.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please provide content to analyze',
        variant: 'destructive'
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const assessment = await AnthropicService.analyzeContentQuality(
        content,
        contentType,
        learningObjectives,
        targetAudience,
        projectId
      );
      
      setQualityMetrics(assessment);
      setActiveTab('quality');
    } catch (error: any) {
      toast({
        title: 'Analysis Failed',
        description: error.message || 'Could not analyze content quality',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Generate enhanced content
  const enhanceContent = async (type: 'clarity' | 'engagement' | 'alignment' | 'simplification' | 'elaboration') => {
    if (!content.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please provide content to enhance',
        variant: 'destructive'
      });
      return;
    }
    
    setIsEnhancing(true);
    setEnhancementType(type);
    
    try {
      const result = await AnthropicService.enhanceContent(
        {
          content,
          enhancementType: type,
          targetAudience,
          learningObjectives
        },
        projectId
      );
      
      setEnhancedContent(result.content);
      setActiveTab('enhancement');
    } catch (error: any) {
      toast({
        title: 'Enhancement Failed',
        description: error.message || 'Could not enhance content',
        variant: 'destructive'
      });
    } finally {
      setIsEnhancing(false);
    }
  };
  
  // Apply the enhanced content
  const applyEnhancement = () => {
    if (onApplyEnhancement && enhancedContent) {
      onApplyEnhancement(enhancedContent);
      
      toast({
        title: 'Enhancement Applied',
        description: 'The enhanced content has been applied',
      });
    }
  };
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Get rating based on score
  const getRating = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };
  
  // Get enhancement type display name
  const getEnhancementName = (type: string) => {
    switch (type) {
      case 'clarity': return 'Clarity Enhancement';
      case 'engagement': return 'Engagement Enhancement';
      case 'alignment': return 'Learning Alignment';
      case 'simplification': return 'Content Simplification';
      case 'elaboration': return 'Detail Elaboration';
      default: return 'Content Enhancement';
    }
  };
  
  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Content Quality Assessment</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={analyzeContentQuality} 
            disabled={isAnalyzing}
            className="gap-1"
          >
            <RefreshCw size={14} className={isAnalyzing ? "animate-spin" : ""} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
        </CardTitle>
        <CardDescription>
          AI-powered evaluation and enhancement of your content
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 m-4">
            <TabsTrigger value="quality" className="flex items-center gap-1">
              <CheckCircle size={15} />
              <span>Quality Assessment</span>
            </TabsTrigger>
            <TabsTrigger value="enhancement" className="flex items-center gap-1">
              <BookOpen size={15} />
              <span>Content Enhancement</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="quality" className="p-4 pt-0">
            {qualityMetrics ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{qualityMetrics.overallScore}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Overall Quality Score</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Content rates as <span className="font-medium">{getRating(qualityMetrics.overallScore)}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Readability</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle size={14} className="text-slate-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Measures how easy your content is to read and understand, considering factors like sentence length, vocabulary complexity, and structure.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="text-sm">{qualityMetrics.readabilityScore}/100</span>
                    </div>
                    <Progress value={qualityMetrics.readabilityScore} max={100} className={getScoreColor(qualityMetrics.readabilityScore)} />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Engagement</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle size={14} className="text-slate-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Evaluates how well your content captures and maintains interest, using elements like examples, interactive components, and conversational tone.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="text-sm">{qualityMetrics.engagementScore}/100</span>
                    </div>
                    <Progress value={qualityMetrics.engagementScore} max={100} className={getScoreColor(qualityMetrics.engagementScore)} />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Learning Alignment</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle size={14} className="text-slate-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Measures how well your content aligns with specified learning objectives or educational goals.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="text-sm">{qualityMetrics.alignmentScore}/100</span>
                    </div>
                    <Progress value={qualityMetrics.alignmentScore} max={100} className={getScoreColor(qualityMetrics.alignmentScore)} />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Accessibility</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle size={14} className="text-slate-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">Evaluates compliance with accessibility standards, inclusive language use, and compatibility with assistive technologies.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="text-sm">{qualityMetrics.accessibilityScore}/100</span>
                    </div>
                    <Progress value={qualityMetrics.accessibilityScore} max={100} className={getScoreColor(qualityMetrics.accessibilityScore)} />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Strengths</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {qualityMetrics.strengths.map((strength: string, index: number) => (
                        <li key={`strength-${index}`} className="text-sm">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Areas for Improvement</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {qualityMetrics.weaknesses.map((weakness: string, index: number) => (
                        <li key={`weakness-${index}`} className="text-sm">{weakness}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Suggestions</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {qualityMetrics.suggestions.map((suggestion: string, index: number) => (
                        <li key={`suggestion-${index}`} className="text-sm">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain size={40} className="mx-auto mb-2 text-slate-400" />
                <h3 className="text-lg font-medium mb-1">No Analysis Available</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Click 'Analyze' to evaluate your content quality
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="enhancement" className="p-4 pt-0">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className={`flex flex-col h-auto py-4 ${enhancementType === 'clarity' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : ''}`}
                  disabled={isEnhancing}
                  onClick={() => enhanceContent('clarity')}
                >
                  <span className="text-base font-medium">Clarity</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Simplify & clarify
                  </span>
                </Button>
                
                <Button
                  variant="outline"
                  className={`flex flex-col h-auto py-4 ${enhancementType === 'engagement' ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : ''}`}
                  disabled={isEnhancing}
                  onClick={() => enhanceContent('engagement')}
                >
                  <span className="text-base font-medium">Engagement</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Make more engaging
                  </span>
                </Button>
                
                <Button
                  variant="outline"
                  className={`flex flex-col h-auto py-4 ${enhancementType === 'alignment' ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30' : ''}`}
                  disabled={isEnhancing}
                  onClick={() => enhanceContent('alignment')}
                >
                  <span className="text-base font-medium">Alignment</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Align with objectives
                  </span>
                </Button>
                
                <Button
                  variant="outline"
                  className={`flex flex-col h-auto py-4 ${enhancementType === 'simplification' ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30' : ''}`}
                  disabled={isEnhancing}
                  onClick={() => enhanceContent('simplification')}
                >
                  <span className="text-base font-medium">Simplify</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Make less complex
                  </span>
                </Button>
                
                <Button
                  variant="outline"
                  className={`flex flex-col h-auto py-4 ${enhancementType === 'elaboration' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' : ''}`}
                  disabled={isEnhancing}
                  onClick={() => enhanceContent('elaboration')}
                >
                  <span className="text-base font-medium">Elaborate</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Add more details
                  </span>
                </Button>
              </div>
              
              {isEnhancing ? (
                <div className="flex justify-center py-12">
                  <div className="space-y-3 text-center">
                    <RefreshCw size={40} className="mx-auto animate-spin text-blue-500" />
                    <p>Enhancing content, please wait...</p>
                  </div>
                </div>
              ) : enhancedContent ? (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <h3 className="font-medium">{getEnhancementName(enhancementType)}</h3>
                    <Badge className="ml-2">AI Generated</Badge>
                  </div>
                  
                  <div className={`p-4 rounded-md border ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                    <div 
                      className="prose dark:prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: enhancedContent.replace(/\n/g, '<br/>') }}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={applyEnhancement}
                      className="gap-1"
                    >
                      <Lightbulb size={14} />
                      Apply Enhancement
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Lightbulb size={40} className="mx-auto mb-2 text-slate-400" />
                  <h3 className="text-lg font-medium mb-1">Select Enhancement Type</h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Choose an enhancement type from above to improve your content
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentQualityAssessor;
