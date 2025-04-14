
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ContentAnalysisService, ContentImprovementSuggestion } from '@/services/ContentAnalysisService';
import { AlertTriangle, Sparkles, MessageCircle, PenLine, Wand2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';

interface ContentImprovementSuggestionsProps {
  content: string;
  contentId: string;
  projectId: string;
  contentType: string;
  onUpdateContent?: (content: string) => void;
}

export const ContentImprovementSuggestions: React.FC<ContentImprovementSuggestionsProps> = ({
  content,
  contentId,
  projectId,
  contentType,
  onUpdateContent
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<ContentImprovementSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isApplyingFix, setIsApplyingFix] = useState<string | null>(null);
  
  const generateSuggestions = async () => {
    if (!content.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please add some content before generating improvement suggestions.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const results = await ContentAnalysisService.generateImprovementSuggestions(
        content,
        contentType,
        projectId
      );
      
      setSuggestions(results);
      
      // Save analysis results to database
      await ContentAnalysisService.saveAnalysisResults(
        contentId,
        projectId,
        'improvement_suggestions',
        results
      );
      
      toast({
        title: 'Suggestions Generated',
        description: `Generated ${results.length} improvement suggestions for your content.`
      });
      
      // Set active tab to the category with the most high priority suggestions
      const categories = ['clarity', 'engagement', 'structure', 'accessibility', 'readability'];
      const categoryWithMostHighPriority = categories.reduce((selected, category) => {
        const currentCount = suggestions.filter(s => s.type === category && s.priority === 'high').length;
        const selectedCount = suggestions.filter(s => s.type === selected && s.priority === 'high').length;
        return currentCount > selectedCount ? category : selected;
      }, 'all');
      
      if (categoryWithMostHighPriority !== 'all' && suggestions.some(s => s.type === categoryWithMostHighPriority && s.priority === 'high')) {
        setActiveTab(categoryWithMostHighPriority);
      }
    } catch (error) {
      console.error('Error generating improvement suggestions:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate improvement suggestions. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const applyImprovement = async (suggestion: ContentImprovementSuggestion) => {
    if (!onUpdateContent || !suggestion.suggestedText) {
      return;
    }
    
    setIsApplyingFix(suggestion.title);
    try {
      // Simple text replacement - in a real app, you'd implement more sophisticated
      // text replacement logic using diffing algorithms
      if (suggestion.originalText && content.includes(suggestion.originalText)) {
        const newContent = content.replace(suggestion.originalText, suggestion.suggestedText);
        onUpdateContent(newContent);
        
        toast({
          title: 'Improvement Applied',
          description: `The suggested improvement has been applied to your content.`
        });
      } else {
        toast({
          title: 'Cannot Apply Automatically',
          description: 'The original text could not be found. Please apply this change manually.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error applying improvement:', error);
      toast({
        title: 'Application Failed',
        description: 'Failed to apply the improvement. Please try again or apply manually.',
        variant: 'destructive'
      });
    } finally {
      setIsApplyingFix(null);
    }
  };
  
  const applyAllImprovements = async () => {
    if (!onUpdateContent) return;
    
    const applicableSuggestions = suggestions.filter(
      s => s.originalText && s.suggestedText && content.includes(s.originalText)
    );
    
    if (applicableSuggestions.length === 0) {
      toast({
        title: 'No Applicable Suggestions',
        description: 'None of the suggestions could be automatically applied.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsApplyingFix('all');
    try {
      let newContent = content;
      
      for (const suggestion of applicableSuggestions) {
        if (suggestion.originalText && suggestion.suggestedText) {
          newContent = newContent.replace(suggestion.originalText, suggestion.suggestedText);
        }
      }
      
      onUpdateContent(newContent);
      
      toast({
        title: 'Improvements Applied',
        description: `Applied ${applicableSuggestions.length} improvements to your content.`
      });
    } catch (error) {
      console.error('Error applying all improvements:', error);
      toast({
        title: 'Application Failed',
        description: 'Failed to apply all improvements. Some changes may have been applied.',
        variant: 'destructive'
      });
    } finally {
      setIsApplyingFix(null);
    }
  };
  
  const filteredSuggestions = activeTab === 'all' 
    ? suggestions
    : suggestions.filter(suggestion => suggestion.type === activeTab);
  
  // Count suggestions by type
  const counts = {
    clarity: suggestions.filter(s => s.type === 'clarity').length,
    engagement: suggestions.filter(s => s.type === 'engagement').length,
    structure: suggestions.filter(s => s.type === 'structure').length,
    accessibility: suggestions.filter(s => s.type === 'accessibility').length,
    readability: suggestions.filter(s => s.type === 'readability').length
  };
  
  // Sort suggestions by priority
  const sortedSuggestions = [...filteredSuggestions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300';
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'clarity':
        return <MessageCircle size={14} />;
      case 'engagement':
        return <Sparkles size={14} />;
      case 'structure':
        return <AlertTriangle size={14} />;
      case 'accessibility':
        return <PenLine size={14} />;
      case 'readability':
        return <Wand2 size={14} />;
      default:
        return null;
    }
  };
  
  return (
    <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles size={18} />
          Content Improvement Suggestions
        </CardTitle>
        <CardDescription>
          Get AI-powered suggestions to improve your content
        </CardDescription>
      </CardHeader>
      
      {!suggestions.length && !isGenerating && (
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-4">
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-full inline-flex items-center justify-center mb-4">
              <Wand2 size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-medium">Content Improvement Suggestions</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Generate AI-powered suggestions to improve clarity, engagement, structure, accessibility, and readability.
            </p>
            <Button 
              onClick={generateSuggestions}
              disabled={isGenerating || !content}
              className="mt-4"
            >
              Generate Improvement Suggestions
            </Button>
          </div>
        </CardContent>
      )}
      
      {isGenerating && (
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <h3 className="text-lg font-medium">Generating Suggestions</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Our AI is analyzing your content and generating targeted improvement suggestions...
            </p>
          </div>
        </CardContent>
      )}
      
      {suggestions.length > 0 && !isGenerating && (
        <>
          <CardContent className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 flex w-full">
                <TabsTrigger value="all" className="flex-1">
                  All ({suggestions.length})
                </TabsTrigger>
                {counts.clarity > 0 && (
                  <TabsTrigger value="clarity" className="flex-1">
                    Clarity ({counts.clarity})
                  </TabsTrigger>
                )}
                {counts.engagement > 0 && (
                  <TabsTrigger value="engagement" className="flex-1">
                    Engagement ({counts.engagement})
                  </TabsTrigger>
                )}
                {counts.structure > 0 && (
                  <TabsTrigger value="structure" className="flex-1">
                    Structure ({counts.structure})
                  </TabsTrigger>
                )}
                {counts.accessibility > 0 && (
                  <TabsTrigger value="accessibility" className="flex-1">
                    Accessibility ({counts.accessibility})
                  </TabsTrigger>
                )}
                {counts.readability > 0 && (
                  <TabsTrigger value="readability" className="flex-1">
                    Readability ({counts.readability})
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value={activeTab}>
                {sortedSuggestions.length > 0 ? (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {sortedSuggestions.map((suggestion, index) => (
                        <div 
                          key={index}
                          className={`p-4 border rounded-md ${
                            suggestion.priority === 'high'
                              ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                              : suggestion.priority === 'medium'
                                ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
                                : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getPriorityBadgeColor(suggestion.priority)}>
                                <span className="capitalize">{suggestion.priority}</span>
                              </Badge>
                              <Badge variant="outline">
                                <span className="flex items-center gap-1">
                                  {getTypeIcon(suggestion.type)}
                                  <span className="capitalize">{suggestion.type}</span>
                                </span>
                              </Badge>
                              {suggestion.section && (
                                <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
                                  {suggestion.section}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <h3 className="font-medium text-base mb-1">{suggestion.title}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                            {suggestion.description}
                          </p>
                          
                          {suggestion.originalText && suggestion.suggestedText && (
                            <div className="mt-3 space-y-2">
                              {suggestion.originalText && (
                                <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded text-sm">
                                  <div className="font-medium mb-1 text-red-600 dark:text-red-400">Original:</div>
                                  <p className="text-slate-700 dark:text-slate-300">{suggestion.originalText}</p>
                                </div>
                              )}
                              
                              {suggestion.suggestedText && (
                                <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded text-sm">
                                  <div className="font-medium mb-1 text-green-600 dark:text-green-400">Suggested:</div>
                                  <p className="text-slate-700 dark:text-slate-300">{suggestion.suggestedText}</p>
                                </div>
                              )}
                              
                              {onUpdateContent && (
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => applyImprovement(suggestion)}
                                  disabled={isApplyingFix !== null}
                                  className="mt-2"
                                >
                                  {isApplyingFix === suggestion.title ? (
                                    <>
                                      <span className="animate-spin h-4 w-4 border-2 border-b-0 border-white rounded-full mr-2"></span>
                                      Applying...
                                    </>
                                  ) : (
                                    <>Apply This Fix</>
                                  )}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center p-8 text-slate-500 dark:text-slate-400">
                    No suggestions found for this category.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="border-t px-6 py-4 flex flex-wrap gap-2">
            <Button 
              onClick={generateSuggestions} 
              variant="outline" 
              disabled={isGenerating}
              className="mr-2"
            >
              <Sparkles size={16} className="mr-2" />
              Generate New Suggestions
            </Button>
            
            {onUpdateContent && suggestions.some(s => s.originalText && s.suggestedText) && (
              <Button 
                onClick={applyAllImprovements}
                disabled={isApplyingFix !== null}
                variant="secondary"
              >
                {isApplyingFix === 'all' ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-b-0 border-white rounded-full mr-2"></span>
                    Applying All...
                  </>
                ) : (
                  <>Apply All Applicable Fixes</>
                )}
              </Button>
            )}
          </CardFooter>
        </>
      )}
    </Card>
  );
};
