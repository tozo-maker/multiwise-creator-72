
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectWorkspaceTabsProps {
  projectId: string;
  activeTab?: string;
}

export const ProjectWorkspaceTabs: React.FC<ProjectWorkspaceTabsProps> = ({ 
  projectId,
  activeTab
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  
  const tabs = [
    { id: 'overview', label: 'Overview', path: `/projects/${projectId}` },
    { id: 'content', label: 'Content', path: `/projects/${projectId}/content` },
    { id: 'outline', label: 'Outline', path: `/projects/${projectId}/outline` },
    { id: 'knowledge-base', label: 'Knowledge Base', path: `/projects/${projectId}/knowledge-base` },
    { id: 'configuration', label: 'Configuration', path: `/projects/${projectId}/configuration` },
  ];
  
  const currentTab = activeTab || tabs.find(tab => location.pathname === tab.path)?.id || 'overview';
  
  return (
    <div className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
      <div className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) => `
              px-4 py-2 text-sm font-medium whitespace-nowrap
              ${isActive || tab.id === currentTab
                ? isDark
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-blue-600 border-b-2 border-blue-500'
                : isDark
                  ? 'text-slate-400 hover:text-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }
              ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}
              transition-colors
            `}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
