
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentItemsList, type ContentItem } from './ContentItemsList';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';

interface ContentItemsCardProps {
  projectId: string;
  contentItems: ContentItem[];
}

export const ContentItemsCard: React.FC<ContentItemsCardProps> = ({ projectId, contentItems }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  return (
    <Card className={theme === 'dark' 
      ? "bg-slate-900 border-slate-800" 
      : "bg-white border-slate-200"
    }>
      <CardHeader className="pb-3">
        <CardTitle className={`text-xl flex justify-between items-center ${
          theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
        }`}>
          <span>Content Items</span>
          <Button
            onClick={() => navigate(`/projects/${projectId}/content/new`)}
            size={isMobile ? "sm" : "default"}
            className="gap-2 bg-brand-600 hover:bg-brand-700 text-white"
          >
            <Plus className="h-4 w-4" />
            New Content
          </Button>
        </CardTitle>
        <CardDescription className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
          Manage your educational content items
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContentItemsList contentItems={contentItems} projectId={projectId} />
      </CardContent>
    </Card>
  );
};
