
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();
  
  const getStatusBadgeClass = (status: string) => {
    if (theme === 'dark') {
      switch (status) {
        case 'draft':
          return 'bg-yellow-900/30 text-yellow-300';
        case 'completed':
          return 'bg-green-900/30 text-green-300';
        case 'in-review':
          return 'bg-blue-900/30 text-blue-300';
        default:
          return 'bg-slate-800 text-slate-300';
      }
    } else {
      switch (status) {
        case 'draft':
          return 'bg-yellow-100 text-yellow-800';
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'in-review':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-slate-100 text-slate-800';
      }
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
        <Card key={item.id} 
          className={`cursor-pointer hover:border-brand-600 transition-colors ${
            theme === 'dark' 
              ? 'bg-slate-700/50 border-slate-600' 
              : 'bg-white border-slate-200'
          }`} 
          onClick={() => navigate(`/projects/${projectId}/content/${item.id}`)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <div className={`h-10 w-10 rounded flex items-center justify-center flex-shrink-0 ${
                  theme === 'dark' ? 'bg-slate-600' : 'bg-slate-100'
                }`}>
                  <FileText className={`h-5 w-5 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`} />
                </div>
                <div>
                  <h3 className={`font-medium ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>{item.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className={theme === 'dark' ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>{item.type}</span>
                    <span className={theme === 'dark' ? 'text-xs text-slate-500' : 'text-xs text-slate-400'}>•</span>
                    <span className={theme === 'dark' ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>Last modified {item.lastModified}</span>
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
  const { theme } = useTheme();
  
  return (
    <Card className={
      theme === 'dark'
        ? 'border-dashed border-2 border-slate-700 bg-slate-800/50'
        : 'border-dashed border-2 border-slate-200 bg-slate-50/50'
    }>
      <CardContent className="p-6 text-center">
        <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
        }`}>
          <FileText className={`h-6 w-6 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-500'
          }`} />
        </div>
        <h3 className={`font-medium mb-1 ${
          theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
        }`}>No content items yet</h3>
        <p className={`text-sm mb-4 ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Start creating educational content for your project
        </p>
        <Button 
          onClick={() => navigate(`/projects/${projectId}/content/new`)}
          className="gap-2 bg-brand-600 hover:bg-brand-700 text-white"
        >
          <Plus className="h-4 w-4" />
          Create Content
        </Button>
      </CardContent>
    </Card>
  );
};
