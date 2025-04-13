
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { AnthropicService } from '@/services/AnthropicService';
import { useTheme } from '@/contexts/ThemeContext';
import { ContentService } from '@/services/ContentService';
import { toast } from '@/hooks/use-toast';
import { FileText, Save, Sparkles } from 'lucide-react';
import { ContentPreview } from './ContentPreview';
import { ContextFilesSection } from './ContextFilesSection';
import { ContentFormActions } from './ContentFormActions';
import { OutlineItemPicker } from '@/components/outline/OutlineItemPicker';
import { ProjectOutline, OutlineItem } from '@/types/outline';
import { OutlineService } from '@/services/OutlineService';

interface FormValues {
  title: string;
  contentType: string;
  prompt: string;
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  audience: 'elementary' | 'middle_school' | 'high_school' | 'undergraduate' | 'graduate' | 'adult_learning';
}

interface ContextFile {
  id: string;
  name: string;
  instructions: string;
}

export const EnhancedContentCreationForm = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      contentType: 'lesson',
      prompt: '',
      complexity: 'intermediate',
      audience: 'elementary',
    }
  });
  
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('edit');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
  const [outline, setOutline] = useState<ProjectOutline | null>(null);
  const [selectedOutlineItem, setSelectedOutlineItem] = useState<OutlineItem | null>(null);
  const [selectedAudience, setSelectedAudience] = useState<'elementary' | 'middle_school' | 'high_school' | 'undergraduate' | 'graduate' | 'adult_learning'>('elementary');

  useEffect(() => {
    const fetchOutline = async () => {
      if (!projectId) return;
      
      try {
        const outlineData = await OutlineService.getOutlineByProject(projectId);
        if (outlineData) {
          const sections = await OutlineService.getSectionsByOutline(outlineData.id);
          setOutline({
            ...outlineData,
            sections
          });
        }
      } catch (error) {
        console.error('Error fetching outline:', error);
      }
    };
    
    fetchOutline();
  }, [projectId]);
  
  const onSubmit = async (values: FormValues) => {
    if (!projectId) return;
    
    setIsGenerating(true);
    try {
      const promptWithOutlineContext = selectedOutlineItem 
        ? `${values.prompt}\n\nThis content is for the outline item titled "${selectedOutlineItem.title}". ${selectedOutlineItem.description ? `The description for this item is: ${selectedOutlineItem.description}` : ''}`
        : values.prompt;
      
      const response = await AnthropicService.generateEnhancedContent({
        prompt: promptWithOutlineContext,
        projectId,
        contentType: values.contentType,
        complexity: values.complexity,
        audience: values.audience,
        knowledgeBaseIds: selectedFiles,
        temperature: 0.7
      });
      
      setGeneratedContent(response.content);
      setActiveTab('preview');
      
      toast({
        title: 'Content Generated',
        description: 'AI has created your content successfully'
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate content',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveContent = async () => {
    if (!projectId || !generatedContent) return;
    
    try {
      const values = form.getValues();
      const contentItem = await ContentService.create({
        title: values.title,
        type: values.contentType,
        content: generatedContent,
        project_id: projectId,
        status: 'draft',
        metadata: {
          audience: values.audience,
          difficultyLevel: values.complexity,
          custom: {
            outlineItemId: selectedOutlineItem?.id,
            knowledgeBaseIds: selectedFiles,
            generatedDate: new Date().toISOString()
          }
        }
      });
      
      if (contentItem && selectedOutlineItem) {
        const updatedItem = {
          ...selectedOutlineItem,
          contentId: contentItem.id,
          status: 'in_progress'
        };
        
        if (outline) {
          const section = outline.sections.find(s => 
            s.items.some(item => item.id === selectedOutlineItem.id)
          );
          
          if (section) {
            const updatedSection = {
              ...section,
              items: section.items.map(item => 
                item.id === selectedOutlineItem.id ? updatedItem : item
              )
            };
            
            await OutlineService.updateOutlineSections(outline);
          }
        }
      }
      
      toast({
        title: 'Content Saved',
        description: 'Your content has been saved successfully'
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save content',
        variant: 'destructive'
      });
    }
  };
  
  const handleSelectOutlineItem = (item: OutlineItem | null) => {
    setSelectedOutlineItem(item);
    if (item) {
      form.setValue('title', item.title);
      if (item.description) {
        const currentPrompt = form.getValues('prompt');
        if (!currentPrompt) {
          form.setValue('prompt', `Create content based on: ${item.description}`);
        }
      }
    }
  };

  const openKnowledgeBaseDialog = () => {
    console.log("Open knowledge base dialog");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="edit" className="gap-1">
              <FileText size={16} />
              <span className="hidden sm:inline">Edit</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-1" disabled={!generatedContent}>
              <Sparkles size={16} />
              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
          </TabsList>
          
          {activeTab === 'preview' && generatedContent && (
            <Button
              onClick={handleSaveContent}
              className="gap-2"
            >
              <Save size={16} />
              Save Content
            </Button>
          )}
        </div>
        
        <TabsContent value="edit" className="space-y-4 m-0">
          {outline && (
            <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
              <CardContent className="p-4">
                <OutlineItemPicker 
                  outline={outline} 
                  selectedItem={selectedOutlineItem}
                  onSelectItem={handleSelectOutlineItem}
                />
              </CardContent>
            </Card>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
                <CardContent className="p-4">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter a title for your content" 
                              {...field} 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="contentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="lesson">Lesson</SelectItem>
                                <SelectItem value="quiz">Quiz</SelectItem>
                                <SelectItem value="worksheet">Worksheet</SelectItem>
                                <SelectItem value="presentation">Presentation</SelectItem>
                                <SelectItem value="summary">Summary</SelectItem>
                                <SelectItem value="exercise">Exercise</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="audience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Audience</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select audience" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="elementary">Elementary</SelectItem>
                                <SelectItem value="middle_school">Middle School</SelectItem>
                                <SelectItem value="high_school">High School</SelectItem>
                                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                                <SelectItem value="graduate">Graduate</SelectItem>
                                <SelectItem value="adult_learning">Adult Learning</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="complexity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complexity</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select complexity" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content Prompt</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe what content you want to generate" 
                              className="min-h-[150px]"
                              {...field} 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <ContextFilesSection 
                contextFiles={contextFiles}
                setContextFiles={setContextFiles}
                openKnowledgeBaseDialog={openKnowledgeBaseDialog}
                projectId={projectId || ''}
                selectedFiles={selectedFiles}
                onSelectedFilesChange={setSelectedFiles}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isGenerating}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-b-0 border-white rounded-full"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate Content
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="preview" className="m-0">
          {generatedContent ? (
            <ContentPreview 
              content={generatedContent} 
              contentType={form.getValues('contentType')} 
            />
          ) : (
            <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Generate content to preview it here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
