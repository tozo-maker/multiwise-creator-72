
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { ContentItemsCard } from '@/components/content/ContentItemsCard';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

// Mock data - Updated to match the ContentItem interface
const mockContentItems = [
  {
    id: '1',
    title: 'Basic Vocabulary List',
    description: 'Common words and phrases for beginners',
    type: 'vocabulary',
    lastModified: '2 hours ago',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Present Tense Conjugation',
    description: 'Rules and examples for verb conjugation in present tense',
    type: 'grammar',
    lastModified: '1 day ago',
    status: 'draft'  // Changed from 'in-progress' to 'draft' to match the interface
  },
  {
    id: '3',
    title: 'Conversation Practice: Introductions',
    description: 'Dialogues for practicing introductions in Spanish',
    type: 'conversation',
    lastModified: '3 days ago',
    status: 'in-review'  // Changed from 'review' to 'in-review' to match the interface
  }
];

const ContentWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Mock project data
  const project = {
    id: projectId || '1',
    name: 'Spanish Language Textbook',
    type: 'Textbook',
    targetLanguage: 'Spanish'
  };
  
  const breadcrumbItems = [
    { label: 'Projects', path: '/projects' },
    { label: project.name, path: `/projects/${projectId}` },
    { label: 'Content' }
  ];
  
  return (
    <ModernLayout contentWidth="wide">
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
          <div>
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Content Items
            </h2>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Manage your educational content for this project
            </p>
          </div>
          
          <Button 
            onClick={() => navigate(`/projects/${projectId}/content/new`)}
            className="gap-2 bg-brand-600 hover:bg-brand-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Create New Content
          </Button>
        </div>
        
        <ContentItemsCard 
          projectId={project.id} 
          contentItems={mockContentItems}
        />
      </div>
    </ModernLayout>
  );
};

export default ContentWorkspace;
