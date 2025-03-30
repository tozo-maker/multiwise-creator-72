
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProjectWorkspaceTabsProps {
  projectId: string;
  activeTab?: string;
}

export const ProjectWorkspaceTabs: React.FC<ProjectWorkspaceTabsProps> = ({ 
  projectId,
  activeTab 
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isTabActive = (tabPath: string) => {
    if (activeTab) {
      return activeTab === tabPath;
    }
    
    if (tabPath === 'overview' && currentPath === `/projects/${projectId}`) {
      return true;
    }
    
    return currentPath.includes(`/projects/${projectId}/${tabPath}`);
  };
  
  const tabs = [
    { id: 'overview', label: 'Overview', path: `/projects/${projectId}` },
    { id: 'content', label: 'Content', path: `/projects/${projectId}/content` },
    { id: 'analysis', label: 'Analysis', path: `/projects/${projectId}/analysis` },
    { id: 'enhancements', label: 'Enhancements', path: `/projects/${projectId}/enhancements` },
    { id: 'knowledge-base', label: 'Knowledge Base', path: `/projects/${projectId}/knowledge-base` },
    { id: 'configuration', label: 'Configuration', path: `/projects/${projectId}/configuration` },
  ];
  
  return (
    <div className="border-b border-slate-200 mt-2">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={tab.path}
            className={cn(
              "inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium",
              isTabActive(tab.id)
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            )}
            aria-current={isTabActive(tab.id) ? "page" : undefined}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};
