
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { ContentItemsCard } from '@/components/content/ContentItemsCard';
import { QuickContentTemplates } from '@/components/content/QuickContentTemplates';
import { ProjectOverviewCards } from '@/components/project/ProjectOverviewCards';
import { ProjectOverviewInfo } from '@/components/project/ProjectOverviewInfo';
import { useTheme } from '@/contexts/ThemeContext';

const ContentWorkspace: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [projectName, setProjectName] = useState<string>('Loading...');
  const { theme } = useTheme();
  
  // Mock content items data
  const contentItems = [
    {
      id: '1',
      title: 'Introduction to Spanish Grammar',
      type: 'Chapter',
      status: 'completed' as const,
      lastModified: '2 days ago'
    },
    {
      id: '2',
      title: 'Basic Vocabulary: Greetings and Introductions',
      type: 'Vocabulary List',
      status: 'draft' as const,
      lastModified: '1 day ago'
    },
    {
      id: '3',
      title: 'Present Tense Conjugation',
      type: 'Grammar Explanation',
      status: 'in-review' as const,
      lastModified: '3 hours ago'
    }
  ];
  
  // Mock project data
  const project = {
    name: 'Spanish Language Course',
    progress: 65,
    description: 'A comprehensive Spanish language course for beginners',
    deadline: 'October 15, 2023',
    lastModified: '3 hours ago',
    owner: 'John Doe'
  };
  
  // Simulate loading project data
  useEffect(() => {
    setTimeout(() => {
      setProjectName(project.name);
    }, 800);
  }, []);
  
  const breadcrumbItems = [
    { label: 'Projects', path: '/projects' },
    { label: projectName, path: `/projects/${projectId}` },
    { label: 'Content' }
  ];
  
  return (
    <ModernLayout contentWidth="wide">
      <div className={`space-y-6 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="pt-4">
          <PageBreadcrumbs items={breadcrumbItems} />
        </div>

        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{projectName}: Content</h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage educational content for this project
          </p>
        </div>
        
        <ProjectOverviewCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ContentItemsCard
              projectId={projectId || ''}
              contentItems={contentItems}
            />
          </div>
          
          <div className="space-y-6">
            <QuickContentTemplates projectId={projectId || ''} />
            <ProjectOverviewInfo project={project} />
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default ContentWorkspace;
