
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { ContentItemsCard } from '@/components/content/ContentItemsCard';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { ContentItem } from '@/components/content/ContentItemsList';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ProjectBreadcrumbs } from '@/components/project/ProjectBreadcrumbs';
import { ProjectService } from '@/services/ProjectService';
import { ContentService } from '@/services/ContentService';

const ContentWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [project, setProject] = useState({
    id: projectId || '',
    name: 'Loading...',
    type: 'Loading...',
    targetLanguage: 'Loading...'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId || !user) return;
      try {
        const projectData = await ProjectService.getById(projectId);
        if (projectData) {
          setProject({
            id: projectData.id,
            name: projectData.name,
            type: projectData.type,
            targetLanguage: projectData.targetLanguage
          });
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project details',
          variant: 'destructive'
        });
      }
    };
    
    const fetchContentItems = async () => {
      if (!projectId || !user) return;
      try {
        setIsLoading(true);
        const items = await ContentService.getByProject(projectId);
        
        const formattedItems = items.map(item => ({
          id: item.id,
          title: item.title,
          type: item.type,
          lastModified: item.updated_at || '',
          status: item.status
        }));
        
        setContentItems(formattedItems);
      } catch (error: any) {
        console.error('Error fetching content items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load content items',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
    fetchContentItems();
  }, [projectId, user]);

  const handleCreateContent = () => {
    if (projectId) {
      navigate(`/projects/${projectId}/content/create`);
    }
  };

  return (
    <ModernLayout contentWidth="wide">
      <div className="space-y-6">
        <ProjectBreadcrumbs projectName={project.name} />
        
        <ProjectWorkspaceHeader projectName={project.name} projectType={project.type} targetLanguage={project.targetLanguage} />
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="content" />
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Content Items
            </h2>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Manage your educational content for this project
            </p>
          </div>
          
          <Button onClick={handleCreateContent} className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Create New Content
          </Button>
        </div>
        
        <ContentItemsCard projectId={project.id} contentItems={contentItems} isLoading={isLoading} />
      </div>
    </ModernLayout>
  );
};

export default ContentWorkspace;
