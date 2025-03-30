
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookText, 
  LineChart, 
  Sparkles, 
  FileBox, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectWorkspaceTabsProps {
  projectId: string;
}

export const ProjectWorkspaceTabs: React.FC<ProjectWorkspaceTabsProps> = ({ projectId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    {
      name: 'Overview',
      path: `/projects/${projectId}`,
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: 'Content',
      path: `/projects/${projectId}/content`,
      icon: <BookText className="h-5 w-5" />
    },
    {
      name: 'Analysis',
      path: `/projects/${projectId}/analysis`,
      icon: <LineChart className="h-5 w-5" />
    },
    {
      name: 'Enhancements',
      path: `/projects/${projectId}/enhancements`,
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      name: 'Knowledge Base',
      path: `/projects/${projectId}/knowledge-base`,
      icon: <FileBox className="h-5 w-5" />
    },
    {
      name: 'Configuration',
      path: `/projects/${projectId}/configuration`,
      icon: <Settings className="h-5 w-5" />
    }
  ];
  
  const isActive = (path: string) => {
    if (path === `/projects/${projectId}`) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="border-b border-slate-200 mb-6">
      <div className="flex space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={cn(
              "flex items-center space-x-2 py-3 px-2 text-sm font-medium border-b-2 transition-colors",
              isActive(tab.path)
                ? "border-brand-500 text-brand-700"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            )}
            onClick={() => navigate(tab.path)}
          >
            <span className={cn(
              isActive(tab.path) ? "text-brand-600" : "text-slate-500"
            )}>
              {tab.icon}
            </span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
