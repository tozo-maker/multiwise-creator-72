
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentFormHeader } from './content-form/ContentFormHeader';
import { ContentTypeSettings } from './content-form/ContentTypeSettings';
import { ContentPreview } from './content-form/ContentPreview';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { AiChatInterface } from '@/components/content/AiChatInterface';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { ContentService } from '@/services/ContentService';

// Define the content types
export type ContentType = 'lesson' | 'quiz' | 'activity' | 'assessment' | 'summary';
export type EducationalLevel = 'elementary' | 'middle' | 'high' | 'college' | 'professional';

export const ContentCreationForm = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Form state
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState<ContentType>('lesson');
  const [targetLevel, setTargetLevel] = useState<EducationalLevel>('high');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for your content');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please generate or write some content');
      return;
    }
    
    try {
      setIsSaving(true);
      
      if (!projectId) {
        throw new Error('Project ID is missing');
      }
      
      // Save content to database using ContentService
      await ContentService.create({
        title: title,
        type: contentType,
        content: content,
        project_id: projectId,
        status: 'draft'
      });
      
      toast.success('Content saved successfully!');
      
      // Navigate back to content list
      navigate(`/projects/${projectId}/content`);
    } catch (error: any) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle content generation from AI
  const handleContentGeneration = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for content generation');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate AI generation for now
      // In a real implementation, this would call a backend API
      setTimeout(() => {
        const generatedContent = `# ${title || 'Generated Content'}\n\nThis is a sample ${contentType} generated for ${targetLevel} level education.\n\n${prompt}\n\n## Section 1\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis euismod, rhoncus metus id, tristique nisi.\n\n## Section 2\n\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`;
        
        setContent(generatedContent);
        setIsGenerating(false);
        toast.success('Content generated successfully!');
      }, 2000);
    } catch (error: any) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content: ' + (error.message || 'Unknown error'));
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <ContentFormHeader title="Create New Content" />
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  Content Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter a title for your content"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white'}
                  required
                />
              </div>
              
              <ContentTypeSettings 
                contentType={contentType} 
                setContentType={setContentType}
                targetLevel={targetLevel}
                setTargetLevel={setTargetLevel}
              />
              
              <div className="pt-4">
                <Label htmlFor="prompt" className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  Content Generation Prompt
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe what content you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className={`h-32 ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white'}`}
                />
                <p className="text-sm mt-2 text-slate-400">
                  Describe the content you want to create. Be specific about topics, key points, and learning objectives.
                </p>
                
                <div className="mt-4">
                  <Button
                    type="button"
                    onClick={handleContentGeneration}
                    disabled={isGenerating}
                    className="bg-brand-600 hover:bg-brand-700 text-white"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Content'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}>
            <div className="p-6">
              <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                Edit Content
              </h3>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`h-[500px] font-mono text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white'}`}
                placeholder="Your content will appear here after generation, or you can write it manually..."
              />
            </div>
          </Card>
          
          <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}>
            <div className="p-6">
              <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                Preview
              </h3>
              <div className="border h-[500px] overflow-auto p-4 rounded-md bg-white dark:bg-slate-900">
                <ContentPreview content={content} />
              </div>
            </div>
          </Card>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/projects/${projectId}/content`)}
            className={isDark ? 'border-slate-600 text-slate-300' : ''}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving || !title || !content}
            className="bg-brand-600 hover:bg-brand-700 text-white"
          >
            {isSaving ? 'Saving...' : 'Save Content'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContentCreationForm;
