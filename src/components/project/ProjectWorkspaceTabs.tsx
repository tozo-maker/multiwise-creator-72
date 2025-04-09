
import React, { useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectWorkspaceTabsProps {
  projectId: string;
  activeTab?: string;
}

export const ProjectWorkspaceTabs: React.FC<ProjectWorkspaceTabsProps> = React.memo(({ 
  projectId,
  activeTab 
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const isTabActive = useCallback((tabPath: string) => {
    if (activeTab) {
      return activeTab === tabPath;
    }
    
    if (tabPath === 'overview' && currentPath === `/projects/${projectId}`) {
      return true;
    }
    
    return currentPath.includes(`/projects/${projectId}/${tabPath}`);
  }, [activeTab, currentPath, projectId]);
  
  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview', path: `/projects/${projectId}` },
    { id: 'content', label: 'Content', path: `/projects/${projectId}/content` },
    { id: 'analysis', label: 'Analysis', path: `/projects/${projectId}/analysis` },
    { id: 'enhancements', label: 'Enhancements', path: `/projects/${projectId}/enhancements` },
    { id: 'knowledge-base', label: 'Knowledge Base', path: `/projects/${projectId}/knowledge-base` },
    { id: 'configuration', label: 'Configuration', path: `/projects/${projectId}/configuration` },
    { id: 'snapshots', label: 'Snapshots', path: `/projects/${projectId}/snapshots` },
  ], [projectId]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = path;
    }
  }, []);

  return (
    <div 
      className={`border-b mb-6 overflow-x-auto ${
        isDark ? 'border-slate-700' : 'border-slate-200'
      }`}
      role="tablist"
      aria-label="Project Navigation Tabs"
    >
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={tab.path}
            className={cn(
              "pb-2 relative text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-1",
              isTabActive(tab.id)
                ? isDark
                  ? "text-indigo-400 border-b-2 border-indigo-500"
                  : "text-indigo-600 border-b-2 border-indigo-500"
                : isDark
                  ? "text-slate-400 hover:text-slate-300"
                  : "text-slate-600 hover:text-slate-900"
            )}
            role="tab"
            aria-selected={isTabActive(tab.id)}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isTabActive(tab.id) ? 0 : -1}
            onKeyDown={(e) => handleKeyDown(e, tab.path)}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
});

ProjectWorkspaceTabs.displayName = 'ProjectWorkspaceTabs';
