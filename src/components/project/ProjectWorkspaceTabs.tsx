
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="border-b border-slate-200 mb-6 overflow-x-auto">
      <Tabs defaultValue={tabs.find(tab => isTabActive(tab.id))?.id || 'overview'} className="w-full">
        <TabsList className="bg-transparent h-auto p-0 w-full flex justify-start space-x-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "h-10 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none",
                "border-b-2 transition-colors font-medium",
                isTabActive(tab.id)
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              )}
              asChild
            >
              <Link to={tab.path} className="flex items-center">{tab.label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
