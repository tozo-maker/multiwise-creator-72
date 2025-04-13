
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentFormHeader } from './ContentFormHeader';
import { ContentPreview } from './ContentPreview';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { ContentService } from '@/services/ContentService';
import { ContentTemplate, TemplateService } from '@/services/TemplateService';
import { TemplateSelector } from '@/components/content/templates/TemplateSelector';
import { TemplateParameterForm } from '@/components/content/templates/TemplateParameterForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { AnthropicService } from '@/services/AnthropicService';
import { KnowledgeBaseService } from '@/services/KnowledgeBaseService';

export type ContentType = 'lesson' | 'quiz' | 'activity' | 'assessment' | 'summary';

export const EnhancedContentCreationForm = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [templateParameters, setTemplateParameters] = useState<Record<string, any>>({});
  const [step, setStep] = useState<'select' | 'configure' | 'edit'>('select');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [knowledgeBaseFiles, setKnowledgeBaseFiles] = useState<any[]>([]);
  const [selectedKnowledgeBaseFiles, setSelectedKnowledgeBaseFiles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'ai-generation' | 'manual'>('ai-generation');
  
  // Load knowledge base files
  useEffect(() => {
    const loadKnowledgeBase = async () => {
      if (!projectId) return;
      
      try {
        const files = await KnowledgeBaseService.getFilesByProject(projectId);
        setKnowledgeBaseFiles(files);
      } catch (error) {
        console.error('Error loading knowledge base files:', error);
      }
    };
    
    loadKnowledgeBase();
  }, [projectId]);
  
  const handleSelectTemplate = (template: ContentTemplate) => {
    setSelectedTemplate(template);
    setTitle(`New ${template.name}`);
    setStep('configure');
  };
  
  const handleParametersChange = (values: Record<string, any>) => {
    setTemplateParameters(values);
  };
  
  const handleGenerateContent = async () => {
    if (!selectedTemplate || !projectId) return;
    
    setIsGenerating(true);
    
    try {
      // Generate AI prompt from template parameters
      const prompt = TemplateService.generatePrompt(selectedTemplate, templateParameters);
      
      // Call Anthropic API
      const response = await AnthropicService.generateContent({
        prompt,
        systemPrompt: selectedTemplate.systemPrompt,
        projectId,
        contentType: selectedTemplate.type,
        knowledgeBaseIds: selectedKnowledgeBaseFiles
      });
      
      setContent(response.content);
      setStep('edit');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !projectId || !selectedTemplate) {
      toast.error('Please provide a title and content');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Save content to database
      await ContentService.create({
        title: title,
        type: selectedTemplate.type,
        content: content,
        project_id: projectId,
        status: 'draft',
        metadata: {
          templateId: selectedTemplate.id,
          parameters: templateParameters
        }
      });
      
      toast.success('Content saved successfully!');
      navigate(`/projects/${projectId}/content`);
    } catch (error: any) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 'select':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                <span className="text-brand-600 dark:text-brand-400 font-semibold">1</span>
              </div>
              <div>
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Select a Template
                </h3>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Choose a template for your educational content
                </p>
              </div>
            </div>
            
            <TemplateSelector onSelectTemplate={handleSelectTemplate} />
          </div>
        );
        
      case 'configure':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setStep('select')}
              >
                <ArrowLeft className="h-4 w-4" /> Back to Templates
              </Button>
            </div>
            
            <div className="flex items-center gap-3 my-6">
              <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                <span className="text-brand-600 dark:text-brand-400 font-semibold">2</span>
              </div>
              <div>
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Configure Template
                </h3>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Customize the template settings for your content
                </p>
              </div>
            </div>
            
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
              
              {selectedTemplate && (
                <TemplateParameterForm
                  template={selectedTemplate}
                  onParametersChange={handleParametersChange}
                  onGenerateContent={handleGenerateContent}
                  isGenerating={isGenerating}
                />
              )}
            </div>
          </div>
        );
        
      case 'edit':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setStep('configure')}
              >
                <ArrowLeft className="h-4 w-4" /> Back to Configuration
              </Button>
            </div>
            
            <div className="flex items-center gap-3 my-6">
              <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                <span className="text-brand-600 dark:text-brand-400 font-semibold">3</span>
              </div>
              <div>
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Edit and Finalize
                </h3>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Review, edit, and save your content
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="title" className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                Content Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white'}
                required
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai-generation" className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  AI Generated
                </TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai-generation" className="space-y-4 pt-4">
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
                        placeholder="Your content will appear here after generation..."
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
                
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateContent()}
                    disabled={isGenerating}
                    className="flex items-center gap-2"
                  >
                    <Wand2 className="h-4 w-4" />
                    Regenerate
                  </Button>
                  
                  <div className="space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/projects/${projectId}/content`)}
                      className={isDark ? 'border-slate-600 text-slate-300' : ''}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving || !title || !content}
                      className="bg-brand-600 hover:bg-brand-700 text-white"
                    >
                      {isSaving ? 'Saving...' : 'Save Content'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="manual" className="space-y-4 pt-4">
                <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}>
                  <div className="p-6">
                    <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      Manual Entry
                    </h3>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className={`h-[500px] font-mono text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white'}`}
                      placeholder="Write your content here..."
                    />
                  </div>
                </Card>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/projects/${projectId}/content`)}
                    className={isDark ? 'border-slate-600 text-slate-300' : ''}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !title || !content}
                    className="bg-brand-600 hover:bg-brand-700 text-white"
                  >
                    {isSaving ? 'Saving...' : 'Save Content'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <ContentFormHeader title="Create New Content" />
      {renderStepContent()}
    </div>
  );
};

export default EnhancedContentCreationForm;
