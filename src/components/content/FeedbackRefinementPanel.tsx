
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { Loader2, RotateCcw, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { AnthropicService } from '@/services/AnthropicService';
import { toast } from '@/hooks/use-toast';

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
  
  const [feedback, setFeedback] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative' | null>(null);
  
  const handleSendFeedback = async () => {
    if (!feedback && !feedbackType) {
      toast({
        title: 'Feedback Required',
        description: 'Please provide some feedback or select a feedback type',
        variant: 'destructive'
      });
      return;
    }
    
    setIsRefining(true);
    try {
      let feedbackPrompt = '';
      
      if (feedbackType === 'positive') {
        feedbackPrompt = `The content is good overall, but could use some improvement. ${feedback || ''}`;
      } else if (feedbackType === 'negative') {
        feedbackPrompt = `The content needs significant improvement. ${feedback || ''}`;
      } else {
        feedbackPrompt = feedback;
      }
      
      const response = await AnthropicService.generateEnhancedContent({
        prompt: `You are reviewing and improving existing content. Original content: """${currentContent}"""\n\nFeedback: ${feedbackPrompt}\n\nPlease provide an improved version of this content addressing the feedback.`,
        projectId,
        contentType,
        complexity,
        audience,
        knowledgeBaseIds: [],
        temperature: 0.5
      });
      
      if (response && response.content) {
        onUpdateContent(response.content);
        toast({
          title: 'Content Refined',
          description: 'The content has been updated based on your feedback'
        });
        setFeedback('');
        setFeedbackType(null);
      }
    } catch (error) {
      console.error('Error refining content:', error);
      toast({
        title: 'Refinement Failed',
        description: 'Failed to refine content based on feedback',
        variant: 'destructive'
      });
    } finally {
      setIsRefining(false);
    }
  };
  
  const handleQuickFeedback = async (type: 'make-simpler' | 'expand' | 'improve-flow' | 'fix-grammar' | 'make-engaging') => {
    setIsRefining(true);
    
    const feedbackMap = {
      'make-simpler': 'Make the content simpler and easier to understand while maintaining the key information',
      'expand': 'Expand the content with more details and examples',
      'improve-flow': 'Improve the flow and organization of the content for better readability',
      'fix-grammar': 'Fix any grammar, spelling, or punctuation issues',
      'make-engaging': 'Make the content more engaging and interesting for the reader'
    };
    
    try {
      const response = await AnthropicService.generateEnhancedContent({
        prompt: `You are reviewing and improving existing content. Original content: """${currentContent}"""\n\nFeedback: ${feedbackMap[type]}\n\nPlease provide an improved version of this content addressing the feedback.`,
        projectId,
        contentType,
        complexity,
        audience,
        knowledgeBaseIds: [],
        temperature: 0.5
      });
      
      if (response && response.content) {
        onUpdateContent(response.content);
        toast({
          title: 'Content Refined',
          description: `Content ${type.replace('-', ' ')}`
        });
      }
    } catch (error) {
      console.error('Error refining content:', error);
      toast({
        title: 'Refinement Failed',
        description: 'Failed to refine content',
        variant: 'destructive'
      });
    } finally {
      setIsRefining(false);
    }
  };
  
  return (
    <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Feedback & Refinement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant={feedbackType === 'positive' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFeedbackType(prev => prev === 'positive' ? null : 'positive')}
            className="flex items-center gap-2"
          >
            <ThumbsUp className="h-4 w-4" />
            Good, but could improve
          </Button>
          <Button 
            variant={feedbackType === 'negative' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFeedbackType(prev => prev === 'negative' ? null : 'negative')}
            className="flex items-center gap-2"
          >
            <ThumbsDown className="h-4 w-4" />
            Needs significant changes
          </Button>
        </div>
        
        <Textarea 
          placeholder="Provide specific feedback or instructions for improvement"
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          className="min-h-[100px]"
        />
        
        <Button 
          onClick={handleSendFeedback} 
          className="w-full"
          disabled={isRefining}
        >
          {isRefining ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refining...
            </>
          ) : 'Refine Content with Custom Feedback'}
        </Button>
        
        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-2">Quick Refinements:</p>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickFeedback('make-simpler')}
              disabled={isRefining}
            >
              Make Simpler
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickFeedback('expand')}
              disabled={isRefining}
            >
              Expand Content
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickFeedback('improve-flow')}
              disabled={isRefining}
            >
              Improve Flow
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickFeedback('fix-grammar')}
              disabled={isRefining}
            >
              Fix Grammar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickFeedback('make-engaging')}
              disabled={isRefining}
              className="col-span-2"
            >
              Make More Engaging
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
