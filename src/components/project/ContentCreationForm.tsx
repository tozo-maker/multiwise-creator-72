
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AiChatInterface } from '@/components/content/AiChatInterface';
import { ContentTypeSettings } from '@/components/project/content-form/ContentTypeSettings';
import { ContentFormActions } from '@/components/project/content-form/ContentFormActions';
import { ContentFormHeader } from '@/components/project/content-form/ContentFormHeader';
import { ContentPreview } from '@/components/project/content-form/ContentPreview';
import { ContextFilesSection } from '@/components/project/content-form/ContextFilesSection';
import { KnowledgeBaseDialog } from '@/components/project/content-form/KnowledgeBaseDialog';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useKnowledgeBaseFiles } from '@/hooks/useKnowledgeBaseFiles';
import { supabase } from '@/integrations/supabase/client';
import { ContentService, ContentCreateInput } from '@/services/ContentService';

type ContentType = 'lesson' | 'quiz' | 'worksheet' | 'presentation' | 'assessment' | 'other';

interface ContextFile {
  id: string;
  name: string;
  instructions: string;
}

export const ContentCreationForm: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { files: knowledgeBaseFiles } = useKnowledgeBaseFiles(projectId);
  
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState<ContentType>('lesson');
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
  const [knowledgeBaseDialogOpen, setKnowledgeBaseDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const generateContent = async () => {
    if (!projectId || !title || !prompt) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a title and prompt before generating content.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Get knowledge base file IDs for context
      const knowledgeBaseIds = contextFiles.map(file => file.id);
      
      const { data, error } = await supabase.functions.invoke('ai-content-generation', {
        body: {
          prompt,
          projectId,
          contentType,
          knowledgeBaseIds
        }
      });
      
      if (error) {
        throw error;
      }
      
      console.log('AI Response:', data);
      setGeneratedContent(data.content || 'No content was generated. Please try again.');
      
    } catch (error: any) {
      console.error('Error generating content:', error);
      toast({
        title: 'Generation Failed',
        description: error.message || 'An error occurred while generating content. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSave = async () => {
    if (!projectId || !title || !generatedContent) {
      toast({
        title: 'Missing Information',
        description: 'Please generate content before saving.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      const contentData: ContentCreateInput = {
        title,
        type: contentType,
        content: generatedContent,
        project_id: projectId,
        status: 'draft'
      };
      
      const savedContent = await ContentService.create(contentData);
      
      toast({
        title: 'Content Saved',
        description: 'Your content has been saved successfully.'
      });
      
      // Navigate to the content view page
      navigate(`/projects/${projectId}/content/${savedContent.id}`);
      
    } catch (error: any) {
      console.error('Error saving content:', error);
      toast({
        title: 'Save Failed',
        description: error.message || 'Failed to save content. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleOpenKnowledgeBaseDialog = () => {
    setKnowledgeBaseDialogOpen(true);
  };
  
  const addFilesToContext = () => {
    const newContextFiles = selectedFiles
      .map(id => {
        const file = knowledgeBaseFiles.find(f => f.id === id);
        if (!file) return null;
        
        // Check if file is already in contextFiles
        const exists = contextFiles.some(cf => cf.id === id);
        if (exists) return null;
        
        return {
          id: file.id,
          name: file.name,
          instructions: `Use information from this ${file.fileType} file to inform the content.`
        };
      })
      .filter(Boolean) as ContextFile[];
    
    setContextFiles([...contextFiles, ...newContextFiles]);
    setKnowledgeBaseDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <Card className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}>
        <div className="p-6">
          <ContentFormHeader 
            title="Create New Content" 
            description="Use AI to generate educational content for your project"
          />
          
          <Separator className="my-6" />
          
          <div className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title">Content Title</Label>
              <Input 
                id="title" 
                placeholder="Enter a descriptive title for your content" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            {/* Content Type */}
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type</Label>
              <Select value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
                <SelectTrigger id="content-type">
                  <SelectValue placeholder="Select a content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lesson">Lesson Plan</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="worksheet">Worksheet</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Content Type Settings */}
            <ContentTypeSettings contentType={contentType} />
            
            {/* Context Files */}
            <ContextFilesSection 
              contextFiles={contextFiles} 
              setContextFiles={setContextFiles}
              openKnowledgeBaseDialog={handleOpenKnowledgeBaseDialog}
            />
            
            {/* AI Prompt Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Generate Content with AI</Label>
              <Textarea 
                id="prompt" 
                placeholder="Describe the content you want to generate..."
                className="min-h-[120px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            
            {/* AI Generate Button */}
            <div className="flex justify-end">
              <Button 
                onClick={generateContent} 
                disabled={isGenerating || !prompt}
                className="bg-brand-600 hover:bg-brand-700"
              >
                {isGenerating ? 'Generating...' : 'Generate Content with AI'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Content Preview */}
      <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
        Content Preview
      </h2>
      
      <ContentPreview 
        title={title} 
        generatedContent={generatedContent} 
      />
      
      {/* Save & Cancel Buttons */}
      {generatedContent && (
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/projects/${projectId}/content`)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !generatedContent}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? 'Saving...' : 'Save Content'}
          </Button>
        </div>
      )}
      
      {/* Knowledge Base Selection Dialog */}
      <KnowledgeBaseDialog 
        isOpen={knowledgeBaseDialogOpen}
        onOpenChange={setKnowledgeBaseDialogOpen}
        knowledgeBaseFiles={knowledgeBaseFiles.map(file => ({
          id: file.id,
          name: file.name,
          description: file.description
        }))}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        addFilesToContext={addFilesToContext}
      />
    </div>
  );
};
