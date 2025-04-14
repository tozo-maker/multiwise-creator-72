import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentService } from '@/services/ContentService';
import { VersionService } from '@/services/VersionService';
import { OutlineService } from '@/services/OutlineService';
import { RichContentEditor } from '@/components/content/RichContentEditor';
import { ContentExport } from '@/components/content/ContentExport';
import { ContentTaggingSystem } from '@/components/content/ContentTaggingSystem';
import { FeedbackRefinementPanel } from '@/components/content/FeedbackRefinementPanel';
import { OutlineNavigation } from '@/components/outline/OutlineNavigation';
import { ContentVersionHistory } from '@/components/content/ContentVersionHistory';
import { ContentInsights } from '@/components/content/ContentInsights';
import { ArrowLeft, Save, FilePlus2 } from 'lucide-react';
import { OutlineItem } from '@/types/outline';

const ContentEditor = () => {
  const { projectId, contentId } = useParams<{ projectId: string; contentId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('lesson');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [complexity, setComplexity] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');
  const [audience, setAudience] = useState<'elementary' | 'middle_school' | 'high_school' | 'undergraduate' | 'graduate' | 'adult_learning'>('elementary');
  const [project, setProject] = useState({
    id: projectId || '',
    name: 'Loading...',
    type: 'Loading...',
    targetLanguage: 'Loading...'
  });
  
  const [relatedOutlineItem, setRelatedOutlineItem] = useState<any>(null);
  const [learningObjectives, setLearningObjectives] = useState<Array<{id: string, text: string}>>([
    { id: 'obj-1', text: 'Understand key concepts of the subject matter' },
    { id: 'obj-2', text: 'Apply theoretical knowledge to practical scenarios' },
    { id: 'obj-3', text: 'Evaluate evidence and form informed conclusions' }
  ]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (projectError) throw projectError;
        
        if (projectData) {
          setProject({
            id: projectData.id,
            name: projectData.name,
            type: projectData.type,
            targetLanguage: projectData.target_language
          });
        }
        
        if (contentId !== 'create') {
          const contentData = await ContentService.getById(contentId!);
          if (contentData) {
            setContent(contentData.content);
            setTitle(contentData.title);
            setContentType(contentData.content_type || contentData.type || 'lesson');
            
            if (contentData.metadata?.tags) {
              setTags(contentData.metadata.tags);
            }
            
            if (contentData.metadata?.category) {
              setCategory(contentData.metadata.category);
            }
            
            if (contentData.metadata?.difficultyLevel) {
              setComplexity(contentData.metadata.difficultyLevel);
            }
            
            if (contentData.metadata?.audience) {
              setAudience(contentData.metadata.audience);
            }
            
            const outlineItemId = contentData.metadata?.custom?.outlineItemId;
            if (outlineItemId) {
              const outlineData = await OutlineService.getOutlineByProject(projectId);
              if (outlineData) {
                const sections = await OutlineService.getSectionsByOutline(outlineData.id);
                
                for (const section of sections) {
                  const item = section.items.find(i => i.id === outlineItemId);
                  if (item) {
                    setRelatedOutlineItem({
                      ...item,
                      sectionTitle: section.title
                    });
                    break;
                  }
                }
              }
            }
          }
        } else {
          const searchParams = new URLSearchParams(location.search);
          const outlineItemId = searchParams.get('outlineItemId');
          
          if (outlineItemId) {
            const outlineData = await OutlineService.getOutlineByProject(projectId);
            if (outlineData) {
              const sections = await OutlineService.getSectionsByOutline(outlineData.id);
              
              for (const section of sections) {
                const item = section.items.find(i => i.id === outlineItemId);
                if (item) {
                  setRelatedOutlineItem({
                    ...item,
                    sectionTitle: section.title
                  });
                  
                  setTitle(item.title);
                  break;
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load content',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [projectId, contentId, location.search]);
  
  const handleSave = async () => {
    if (!projectId) return;
    
    setIsSaving(true);
    try {
      const metadata = {
        tags,
        category,
        audience,
        difficultyLevel: complexity,
        wordCount: content.split(/\s+/).length,
        custom: {
          outlineItemId: relatedOutlineItem?.id,
        }
      };
      
      if (contentId && contentId !== 'create') {
        const contentItem = await ContentService.update(contentId, {
          title,
          content,
          content_type: contentType,
          metadata
        });
        
        await VersionService.createVersion(
          contentId,
          content,
          title,
          contentType,
          metadata,
          'Manual update'
        );
        
        if (relatedOutlineItem?.id) {
          const outlineData = await OutlineService.getOutlineByProject(projectId);
          if (outlineData) {
            const sections = await OutlineService.getSectionsByOutline(outlineData.id);
            
            for (const section of sections) {
              const itemIndex = section.items.findIndex(i => i.id === relatedOutlineItem.id);
              if (itemIndex >= 0) {
                const updatedItem: OutlineItem = {
                  ...section.items[itemIndex],
                  contentId,
                  status: 'in_progress'
                };
                
                section.items[itemIndex] = updatedItem;
                
                await OutlineService.updateOutlineSections(outlineData);
                break;
              }
            }
          }
        }
        
        toast({
          title: 'Content Updated',
          description: 'Your content has been updated successfully'
        });
      } else {
        const contentItem = await ContentService.create({
          title,
          content,
          type: contentType,
          project_id: projectId,
          status: 'draft',
          metadata
        });
        
        if (contentItem && relatedOutlineItem?.id) {
          const outlineData = await OutlineService.getOutlineByProject(projectId);
          if (outlineData) {
            const sections = await OutlineService.getSectionsByOutline(outlineData.id);
            
            for (const section of sections) {
              const itemIndex = section.items.findIndex(i => i.id === relatedOutlineItem.id);
              if (itemIndex >= 0) {
                const updatedItem: OutlineItem = {
                  ...section.items[itemIndex],
                  contentId: contentItem.id,
                  status: 'in_progress'
                };
                
                section.items[itemIndex] = updatedItem;
                
                await OutlineService.updateOutlineSections(outlineData);
                break;
              }
            }
          }
        }
        
        toast({
          title: 'Content Created',
          description: 'Your content has been created successfully'
        });
        
        if (contentItem) {
          navigate(`/projects/${projectId}/content/${contentItem.id}`);
        }
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save content',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleRestoreVersion = async (version: any) => {
    setContent(version.content);
    setTitle(version.title);
    
    toast({
      title: 'Version Restored',
      description: `Content restored to version ${version.version}`
    });
  };
  
  const breadcrumbItems = [
    { label: 'Projects', path: '/projects' },
    { label: project.name, path: `/projects/${projectId}` },
    { label: 'Content', path: `/projects/${projectId}/content` },
    { label: contentId === 'create' ? 'Create Content' : title }
  ];
  
  if (isLoading) {
    return (
      <DashboardLayout contentWidth="wide">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout contentWidth="wide">
      <div className="space-y-6">
        <div className="pt-4">
          <PageBreadcrumbs items={breadcrumbItems} />
        </div>
        
        <ProjectWorkspaceHeader 
          projectName={project.name}
          projectType={project.type}
          targetLanguage={project.targetLanguage}
        />
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="content" />
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => navigate(`/projects/${projectId}/content`)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Content Items
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="default"
              className="gap-2"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-b-0 border-white rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Content
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1 space-y-4">
            <OutlineNavigation 
              projectId={projectId!}
              activeItemId={relatedOutlineItem?.id}
              displayMode="sidebar"
            />
            
            {contentId !== 'create' && (
              <ContentVersionHistory
                contentId={contentId!}
                currentVersion={1}
                onRestoreVersion={handleRestoreVersion}
              />
            )}
            
            <ContentTaggingSystem
              initialTags={tags}
              initialCategory={category}
              onTagsChange={setTags}
              onCategoryChange={setCategory}
            />
            
            <ContentExport
              content={content}
              title={title}
              tags={tags}
              metadata={{
                category,
                complexity,
                audience
              }}
            />
          </div>
          
          <div className="xl:col-span-3 space-y-6">
            <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
              <CardContent className="p-4">
                <Input
                  placeholder="Content Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-bold py-6 px-3 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                
                {relatedOutlineItem && (
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-2 mb-4`}>
                    From outline: <strong>{relatedOutlineItem.sectionTitle}</strong> &gt; {relatedOutlineItem.title}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="refinement">AI Refinement</TabsTrigger>
                <TabsTrigger value="insights">Content Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="editor">
                <RichContentEditor
                  initialContent={content}
                  onSaveContent={setContent}
                />
              </TabsContent>
              
              <TabsContent value="refinement">
                <FeedbackRefinementPanel
                  currentContent={content}
                  contentType={contentType}
                  complexity={complexity}
                  audience={audience}
                  onUpdateContent={setContent}
                  projectId={projectId!}
                />
              </TabsContent>
              
              <TabsContent value="insights">
                <ContentInsights
                  content={content}
                  contentId={contentId || 'temp-new-content'}
                  projectId={projectId!}
                  contentType={contentType}
                  learningObjectives={learningObjectives}
                  onUpdateContent={setContent}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContentEditor;
