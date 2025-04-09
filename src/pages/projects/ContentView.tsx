
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
import { ArrowLeft, Clock, Edit2, Eye, FileText, Save } from 'lucide-react';

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
  const [status, setStatus] = useState<'draft' | 'in-review' | 'completed'>('draft');
  
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
        status: newStatus as 'draft' | 'in-review' | 'completed'
      });
      
      setStatus(newStatus as 'draft' | 'in-review' | 'completed');
      
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
  
  const breadcrumbItems = [
    { label: 'Projects', path: '/projects' },
    { label: project.name, path: `/projects/${projectId}` },
    { label: 'Content', path: `/projects/${projectId}/content` },
    { label: contentItem?.title || 'Loading...' }
  ];
  
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
                Last modified: {contentItem?.updated_at}
              </span>
            </div>
            
            <Select value={status} onValueChange={handleStatusChange} disabled={isSaving}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
        
        <Card className={isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className={`w-5 h-5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`} />
              <span className={`text-sm font-medium uppercase ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {contentItem?.type}
              </span>
            </div>
            <CardTitle className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {contentItem?.title}
            </CardTitle>
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
    </ModernLayout>
  );
};

export default ContentView;
