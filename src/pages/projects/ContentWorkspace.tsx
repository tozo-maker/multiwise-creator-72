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
const ContentWorkspace = () => {
  const {
    projectId
  } = useParams<{
    projectId: string;
  }>();
  const navigate = useNavigate();
  const {
    theme
  } = useTheme();
  const {
    user
  } = useAuth();
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
        const {
          data,
          error
        } = await supabase.from('projects').select('*').eq('id', projectId).single();
        if (error) throw error;
        if (data) {
          setProject({
            id: data.id,
            name: data.name,
            type: data.type,
            targetLanguage: data.target_language
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
        const {
          data,
          error
        } = await supabase.from('content_items').select('*').eq('project_id', projectId).order('created_at', {
          ascending: false
        });
        if (error) {
          console.error('Error fetching content items:', error);
          throw error;
        }
        if (data && data.length > 0) {
          const formattedItems = data.map(item => ({
            id: item.id,
            title: item.title,
            type: item.type,
            lastModified: new Date(item.updated_at).toLocaleString(),
            status: item.status
          }));
          setContentItems(formattedItems);
        } else {
          // Empty array is a valid response, not an error
          setContentItems([]);
        }
      } catch (error: any) {
        console.error('Error fetching content items:', error);
        // Only show toast for actual errors, not for empty results
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
  }, [projectId, user, toast]);
  return <ModernLayout contentWidth="wide">
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
          
          
        </div>
        
        <ContentItemsCard projectId={project.id} contentItems={contentItems} isLoading={isLoading} />
      </div>
    </ModernLayout>;
};
export default ContentWorkspace;