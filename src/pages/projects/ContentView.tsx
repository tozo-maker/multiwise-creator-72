
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { ProjectBreadcrumbs } from '@/components/project/ProjectBreadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProjectService } from '@/services/ProjectService';
import { ContentService, ContentItem } from '@/services/ContentService';
import { ApprovalService, ApprovalStep } from '@/services/ApprovalService';
import { ApprovalWorkflow } from '@/components/content/ApprovalWorkflow';
import { ContentVersionHistory } from '@/components/content/ContentVersionHistory';
import { ContentExport } from '@/components/content/ContentExport';
import { OutlineNavigation } from '@/components/outline/OutlineNavigation';
import { ArrowLeft, Clock, Download, Edit2, Eye, FileText, Save, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { VersionService } from '@/services/VersionService';
import { OutlineService } from '@/services/OutlineService';

const ContentView = () => {
  const { projectId, contentId } = useParams<{ projectId: string; contentId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();
  const isDark = theme === 'dark';
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [project, setProject] = useState({
    id: projectId || '',
    name: 'Loading...',
    type: 'Loading...',
    targetLanguage: 'Loading...'
  });
  const [contentItem, setContentItem] = useState<ContentItem | null>(null);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived' | 'in-review'>('draft');
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>([]);
  const [relatedOutlineItem, setRelatedOutlineItem] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!projectId || !contentId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch project data
        const projectData = await ProjectService.getById(projectId);
        if (projectData) {
          setProject({
            id: projectData.id,
            name: projectData.name,
            type: projectData.type,
            targetLanguage: projectData.targetLanguage
          });
        }
        
        // Fetch content item
        const contentData = await ContentService.getById(contentId);
        if (contentData) {
          setContentItem(contentData);
          setStatus(contentData.status);
          
          // Check if this content is related to an outline item
          const outlineItemId = contentData.metadata?.custom?.outlineItemId;
          if (outlineItemId) {
            // Fetch outline to find the related item
            const outlineData = await OutlineService.getOutlineByProject(projectId);
            if (outlineData) {
              const sections = await OutlineService.getSectionsByOutline(outlineData.id);
              
              // Find the related outline item
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
          
          // If content has approval workflow in metadata, load it
          if (contentData.metadata?.approvalWorkflow) {
            setApprovalSteps(contentData.metadata.approvalWorkflow);
          } else {
            // Otherwise create a default workflow
            const defaultWorkflow = await ApprovalService.createWorkflow(contentId);
            setApprovalSteps(defaultWorkflow);
          }
        } else {
          toast({
            title: 'Not Found',
            description: 'The requested content item was not found.',
            variant: 'destructive'
          });
          navigate(`/projects/${projectId}/content`);
        }
      } catch (error: any) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to load content.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [projectId, contentId, navigate, toast]);
  
  const handleStatusChange = async (newStatus: string) => {
    if (!contentItem) return;
    
    try {
      setIsSaving(true);
      
      await ContentService.update(contentItem.id, {
        status: newStatus as 'draft' | 'published' | 'archived' | 'in-review'
      });
      
      setStatus(newStatus as 'draft' | 'published' | 'archived' | 'in-review');
      
      toast({
        title: 'Status Updated',
        description: `Content status updated to ${newStatus}.`
      });
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update content status.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprovalUpdate = async (steps: ApprovalStep[]) => {
    if (!contentItem) return;
    
    try {
      setIsSaving(true);
      
      // Update content item with approval workflow in metadata
      await ContentService.update(contentItem.id, {
        metadata: {
          ...(contentItem.metadata || {}),
          approvalWorkflow: steps
        }
      });
      
      setApprovalSteps(steps);
      
      toast({
        title: 'Workflow Updated',
        description: 'Approval workflow has been updated.'
      });
    } catch (error: any) {
      console.error('Error updating workflow:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update approval workflow.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreVersion = async (version: any) => {
    if (!contentItem) return;
    
    try {
      setIsSaving(true);
      
      // Restore content from a specific version
      const success = await VersionService.restoreVersion(version.id);
      
      if (success) {
        // Refresh content data
        const refreshedContent = await ContentService.getById(contentId!);
        if (refreshedContent) {
          setContentItem(refreshedContent);
        }
        
        toast({
          title: 'Version Restored',
          description: `Restored to version ${version.version}`
        });
      }
    } catch (error: any) {
      console.error('Error restoring version:', error);
      toast({
        title: 'Restore Failed',
        description: error.message || 'Failed to restore version.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (isLoading) {
    return (
      <ModernLayout contentWidth="wide">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </ModernLayout>
    );
  }
  
  return (
    <ModernLayout contentWidth="wide">
      <div className="space-y-6">
        <ProjectBreadcrumbs projectName={project.name} />
        
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
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Last modified: {formatDate(contentItem?.updated_at || '')}
              </span>
            </div>
            
            <Select value={status} onValueChange={handleStatusChange} disabled={isSaving}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate(`/projects/${projectId}/content/${contentId}/edit`)}
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <OutlineNavigation 
              projectId={projectId!}
              activeItemId={relatedOutlineItem?.id}
              displayMode="sidebar"
            />
            
            <ApprovalWorkflow
              contentId={contentItem?.id || ''}
              currentStatus={status}
              approvalSteps={approvalSteps}
              onStatusChange={handleStatusChange}
              onApprovalUpdate={handleApprovalUpdate}
              isEditable={true}
            />
            
            <ContentVersionHistory
              contentId={contentItem?.id || ''}
              currentVersion={contentItem?.version || 1}
              onRestoreVersion={handleRestoreVersion}
            />
            
            {contentItem && (
              <ContentExport
                content={contentItem.content}
                title={contentItem.title}
                tags={contentItem.metadata?.tags || []}
                metadata={contentItem.metadata}
              />
            )}
          </div>
          
          <div className="xl:col-span-3 space-y-6">
            <Card className={isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className={`w-5 h-5 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`} />
                  <span className={`text-sm font-medium uppercase ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {contentItem?.content_type}
                  </span>
                </div>
                <CardTitle className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {contentItem?.title}
                </CardTitle>
                
                {contentItem?.metadata?.tags && contentItem.metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    {contentItem.metadata.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="px-2 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center mt-2">
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Version: {contentItem?.version || 1}
                    {contentItem?.metadata?.wordCount && (
                      <span> • {contentItem.metadata.wordCount} words</span>
                    )}
                    {contentItem?.metadata?.category && (
                      <span> • Category: {contentItem.metadata.category}</span>
                    )}
                  </div>
                </div>
                
                {relatedOutlineItem && (
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-2`}>
                    From outline: <strong>{relatedOutlineItem.sectionTitle}</strong> &gt; {relatedOutlineItem.title}
                  </div>
                )}
              </CardHeader>
              <Separator className={isDark ? 'bg-slate-700' : 'bg-slate-200'} />
              <CardContent className="pt-6">
                <div className={`prose max-w-none ${
                  isDark ? 'prose-invert text-slate-300' : 'text-slate-700'
                }`}>
                  {contentItem?.content.split('\n').map((line, i) => (
                    <p key={i} className={!line ? 'mb-4' : ''}>
                      {line || <br />}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default ContentView;
