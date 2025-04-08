
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'completed' | 'in-review';
  lastModified: string;
}

interface ContentItemsListProps {
  contentItems: ContentItem[];
  projectId: string;
}

export const ContentItemsList: React.FC<ContentItemsListProps> = ({ contentItems, projectId }) => {
  const navigate = useNavigate();
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in-review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };
  
  if (contentItems.length === 0) {
    return (
      <EmptyContentItems projectId={projectId} />
    );
  }
  
  return (
    <div className="space-y-3">
      {contentItems.map((item) => (
        <Card key={item.id} className="cursor-pointer hover:border-indigo-800 transition-colors bg-slate-700/50 border-slate-600" 
          onClick={() => navigate(`/projects/${projectId}/content/${item.id}`)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 rounded bg-slate-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-slate-300" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-100">{item.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-slate-400">{item.type}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">Last modified {item.lastModified}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadgeClass(item.status)}`}>
                  {item.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Empty state component
const EmptyContentItems: React.FC<{ projectId: string }> = ({ projectId }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-dashed border-2 border-slate-700 bg-slate-800/50">
      <CardContent className="p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mb-3">
          <FileText className="h-6 w-6 text-slate-300" />
        </div>
        <h3 className="font-medium text-slate-100 mb-1">No content items yet</h3>
        <p className="text-slate-400 text-sm mb-4">
          Start creating educational content for your project
        </p>
        <Button 
          onClick={() => navigate(`/projects/${projectId}/content/new`)}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="h-4 w-4" />
          Create Content
        </Button>
      </CardContent>
    </Card>
  );
};

// Need to import Button and Plus
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
