
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { AnthropicService } from '@/services/AnthropicService';
import { OutlineService } from '@/services/OutlineService';
import { DocumentInsightService } from '@/services/document-insights';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Wand2, MessageSquare, RefreshCw, CheckCircle, ClipboardCheck, Paintbrush, FileStack, FileBarChart } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FeedbackRefinementPanelProps {
  currentContent: string;
  contentType: string;
  complexity: string;
  audience: string;
  onUpdateContent: (content: string) => void;
  projectId: string;
}

export const FeedbackRefinementPanel: React.FC<FeedbackRefinementPanelProps> = ({
  currentContent,
  contentType,
  complexity,
  audience,
  onUpdateContent,
  projectId
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [activeTab, setActiveTab] = useState<'feedback' | 'enhance' | 'context'>('feedback');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refinementType, setRefinementType] = useState<'improve' | 'simplify' | 'expand' | 'fix' | 'restructure'>('improve');
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [outlineContext, setOutlineContext] = useState<any>(null);
  const [documentInsights, setDocumentInsights] = useState<any[]>([]);
  const [selectedInsights, setSelectedInsights] = useState<string[]>([]);
  const [generatedFeedback, setGeneratedFeedback] = useState('');
  
  // Generate AI feedback on the content
  const handleGenerateFeedback = async () => {
    if (currentContent.trim().length < 10) {
      toast({
        title: 'Content Too Short',
        description: 'Please add more content before generating feedback',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await AnthropicService.getContentFeedback(currentContent, contentType, {
        projectId,
        audience,
        complexity
      });
      
      setGeneratedFeedback(response.content);
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate feedback',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply feedback to refine content
  const handleApplyFeedback = async () => {
    const feedbackToApply = feedback || generatedFeedback;
    
    if (!feedbackToApply.trim()) {
      toast({
        title: 'No Feedback',
        description: 'Please provide feedback or generate AI feedback first',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await AnthropicService.generateContentRefinement(
        currentContent,
        feedbackToApply,
        {
          projectId,
          contentType,
          audience,
          complexity
        }
      );
      
      onUpdateContent(response.content);
      toast({
        title: 'Content Refined',
        description: 'Content has been updated based on feedback',
      });
    } catch (error) {
      console.error('Error refining content:', error);
      toast({
        title: 'Error',
        description: 'Failed to refine content',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply specific enhancement to content
  const handleEnhanceContent = async () => {
    if (!refinementType) {
      toast({
        title: 'Select Enhancement Type',
        description: 'Please select a type of enhancement',
        variant: 'destructive'
      });
      return;
    }
    
    let prompt = '';
    switch (refinementType) {
      case 'improve':
        prompt = 'Improve the overall quality and effectiveness of this content.';
        break;
      case 'simplify':
        prompt = 'Simplify this content to make it more accessible and easier to understand.';
        break;
      case 'expand':
        prompt = 'Expand this content with more details, examples, and explanations.';
        break;
      case 'fix':
        prompt = 'Fix any grammar, spelling, or clarity issues in this content.';
        break;
      case 'restructure':
        prompt = 'Restructure this content to improve flow and organization.';
        break;
    }
    
    if (refinementPrompt) {
      prompt += ` Specifically: ${refinementPrompt}`;
    }
    
    setIsLoading(true);
    try {
      // Load contextual data if needed
      await loadContextualData();
      
      const response = await AnthropicService.generateEnhancedContent({
        prompt,
        systemPrompt: `You are an educational content enhancer. Your task is to ${refinementType} the provided content while maintaining its educational purpose. ${refinementPrompt}
        
ORIGINAL CONTENT:
${currentContent}

Please provide an enhanced version addressing the request while maintaining tone, style, and educational effectiveness.`,
        projectId,
        contentType,
        audience,
        complexity,
        outlineContext,
        documentInsights: selectedInsights.length > 0 
          ? documentInsights.filter(d => selectedInsights.includes(d.id))
          : undefined
      });
      
      onUpdateContent(response.content);
      toast({
        title: 'Content Enhanced',
        description: `Content has been ${refinementType}d successfully`,
      });
    } catch (error) {
      console.error('Error enhancing content:', error);
      toast({
        title: 'Error',
        description: 'Failed to enhance content',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load contextual data for richer AI generation
  const loadContextualData = async () => {
    if (outlineContext || documentInsights.length > 0) return;
    
    try {
      // Get outline context
      const outline = await OutlineService.getOutlineByProject(projectId);
      if (outline) {
        const sections = await OutlineService.getSectionsByOutline(outline.id);
        
        // Find if this content is related to any outline item
        let foundContext = null;
        
        sections.forEach(section => {
          section.items.forEach(item => {
            if (item.metadata?.custom?.currentEdit) {
              foundContext = {
                sectionTitle: section.title,
                currentItem: item,
                sectionItems: section.items
              };
            }
          });
        });
        
        if (foundContext) {
          setOutlineContext(foundContext);
        }
      }
      
      // Get document insights
      const insights = await DocumentInsightService.getByProjectId(projectId);
      if (insights && insights.length > 0) {
        setDocumentInsights(insights);
      }
    } catch (error) {
      console.error('Error loading contextual data:', error);
    }
  };
  
  const toggleInsightSelection = (id: string) => {
    setSelectedInsights(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  // Initialize context loading
  React.useEffect(() => {
    loadContextualData();
  }, [projectId]);
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'feedback' | 'enhance' | 'context')}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Feedback</span>
          </TabsTrigger>
          <TabsTrigger value="enhance" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            <span>Enhance</span>
          </TabsTrigger>
          <TabsTrigger value="context" className="flex items-center gap-2">
            <FileStack className="h-4 w-4" />
            <span>Context</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="feedback" className="space-y-4">
          <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className={`text-lg font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Content Feedback
                </h3>
                <Button
                  onClick={handleGenerateFeedback}
                  disabled={isLoading}
                  variant="outline"
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate AI Feedback</span>
                    </>
                  )}
                </Button>
              </div>
              
              {generatedFeedback ? (
                <ScrollArea className="h-72 border rounded-md p-3">
                  <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: generatedFeedback.replace(/\n/g, '<br/>') }}></div>
                </ScrollArea>
              ) : (
                <div className="h-72 border rounded-md p-4 flex items-center justify-center">
                  <p className={`text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Generate AI feedback or enter your own below
                  </p>
                </div>
              )}
              
              <div>
                <p className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Custom feedback:</p>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your own feedback or edit the AI-generated feedback above..."
                  className="min-h-24"
                />
              </div>
              
              <Button
                onClick={handleApplyFeedback}
                disabled={isLoading || (!feedback && !generatedFeedback)}
                className="w-full gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Applying Feedback...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Apply Feedback to Content</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="enhance" className="space-y-4">
          <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
            <CardContent className="p-4 space-y-4">
              <h3 className={`text-lg font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Enhance Content
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Enhancement type:</p>
                  <RadioGroup value={refinementType} onValueChange={(v) => setRefinementType(v as any)}>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="improve" id="improve" />
                        <Label htmlFor="improve" className="cursor-pointer">Improve Quality</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="simplify" id="simplify" />
                        <Label htmlFor="simplify" className="cursor-pointer">Simplify</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expand" id="expand" />
                        <Label htmlFor="expand" className="cursor-pointer">Expand Details</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fix" id="fix" />
                        <Label htmlFor="fix" className="cursor-pointer">Fix Issues</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="restructure" id="restructure" />
                        <Label htmlFor="restructure" className="cursor-pointer">Restructure</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <p className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Specific instructions (optional):</p>
                  <Input
                    value={refinementPrompt}
                    onChange={(e) => setRefinementPrompt(e.target.value)}
                    placeholder="E.g., Add more examples, Use simpler vocabulary, Add concluding paragraph..."
                  />
                </div>
                
                <div className="pt-2">
                  <Button
                    onClick={handleEnhanceContent}
                    disabled={isLoading}
                    className="w-full gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Enhancing Content...</span>
                      </>
                    ) : (
                      <>
                        <Paintbrush className="h-4 w-4" />
                        <span>Enhance Content</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="context" className="space-y-4">
          <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
            <CardContent className="p-4 space-y-4">
              <h3 className={`text-lg font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Contextual Data
              </h3>
              
              {outlineContext ? (
                <div className="border rounded p-3 space-y-2">
                  <h4 className="font-medium">Outline Context</h4>
                  <p><strong>Section:</strong> {outlineContext.sectionTitle}</p>
                  <p><strong>Current Item:</strong> {outlineContext.currentItem?.title}</p>
                  
                  {outlineContext.currentItem?.description && (
                    <p><strong>Description:</strong> {outlineContext.currentItem.description}</p>
                  )}
                  
                  <h5 className="font-medium text-sm mt-2">Related Items:</h5>
                  <ul className="text-sm list-disc pl-5">
                    {outlineContext.sectionItems
                      ?.filter((item: any) => item.id !== outlineContext.currentItem?.id)
                      .map((item: any) => (
                        <li key={item.id}>
                          {item.title}
                          {item.status === 'completed' && ' (Completed)'}
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                <div className="border rounded p-4 text-center">
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    No outline context available for this content.
                  </p>
                </div>
              )}
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Document Insights</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={selectedInsights.length === 0}
                    onClick={() => setSelectedInsights([])}
                    className="text-xs h-7"
                  >
                    Clear Selection
                  </Button>
                </div>
                
                {documentInsights.length > 0 ? (
                  <ScrollArea className="h-72">
                    <div className="space-y-2">
                      {documentInsights.map((insight) => (
                        <Card key={insight.id} className={`border ${selectedInsights.includes(insight.id) ? 'border-blue-500' : ''}`}>
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-sm">{insight.title}</h5>
                                {insight.summary && (
                                  <p className="text-xs mt-1 text-slate-500">{insight.summary.substring(0, 100)}...</p>
                                )}
                              </div>
                              <Button
                                variant={selectedInsights.includes(insight.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleInsightSelection(insight.id)}
                                className="h-7 gap-1"
                              >
                                {selectedInsights.includes(insight.id) ? (
                                  <>
                                    <CheckCircle className="h-3 w-3" />
                                    <span className="text-xs">Selected</span>
                                  </>
                                ) : (
                                  <span className="text-xs">Use</span>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="border rounded p-4 text-center">
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      No document insights available for this project.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={loadContextualData}
                  disabled={isLoading}
                  className="w-full gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh Contextual Data</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
