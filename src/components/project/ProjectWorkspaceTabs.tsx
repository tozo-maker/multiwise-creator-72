
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
    { id: 'snapshots', label: 'Snapshots', path: `/projects/${projectId}/snapshots` },
  ];
  
  return (
    <div className="border-b border-slate-700 mb-6 overflow-x-auto">
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={tab.path}
            className={cn(
              "pb-2 relative text-sm font-medium",
              isTabActive(tab.id)
                ? "text-indigo-400 border-b-2 border-indigo-500"
                : "text-slate-400 hover:text-slate-300"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
