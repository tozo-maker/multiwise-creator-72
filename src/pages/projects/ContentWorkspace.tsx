
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { ContentItemsCard } from '@/components/content/ContentItemsCard';
import { QuickContentTemplates } from '@/components/content/QuickContentTemplates';
import { type ContentItem } from '@/components/content/ContentItemsList';

export const ContentWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  // Mock project data - would normally be fetched based on ID
  const project = {
    id: projectId || '1',
    name: 'Spanish Language Textbook',
    type: 'Textbook',
    targetLanguage: 'Spanish',
    lastModified: '2 hours ago',
    progress: 65
  };
  
  // Mock content items
  const [contentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Introduction to Spanish Greetings',
      type: 'Lesson',
      status: 'completed',
      lastModified: '2 days ago'
    },
    {
      id: '2',
      title: 'Present Tense Conjugation',
      type: 'Grammar Reference',
      status: 'completed',
      lastModified: '1 week ago'
    },
    {
      id: '3',
      title: 'Basic Vocabulary - Food and Drinks',
      type: 'Vocabulary',
      status: 'draft',
      lastModified: '3 hours ago'
    },
    {
      id: '4',
      title: 'Practice Exercise - Greetings',
      type: 'Exercise',
      status: 'in-review',
      lastModified: '5 days ago'
    }
  ]);
  
  const breadcrumbItems = [
    { label: 'Projects', path: '/projects' },
    { label: project.name, path: `/projects/${projectId}` },
    { label: 'Content' }
  ];
  
  return (
    <ModernLayout contentWidth="wide">
      <div className="space-y-6 bg-slate-900">
        <div className="pt-4">
          <PageBreadcrumbs items={breadcrumbItems} />
        </div>
        
        <ProjectWorkspaceHeader 
          projectName={project.name}
          projectType={project.type}
          targetLanguage={project.targetLanguage}
        />
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="content" />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ContentItemsCard 
              projectId={project.id} 
              contentItems={contentItems} 
            />
          </div>
          
          <div>
            <QuickContentTemplates projectId={project.id} />
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default ContentWorkspace;
