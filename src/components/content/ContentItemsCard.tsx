import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentItemsList, type ContentItem } from './ContentItemsList';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';
interface ContentItemsCardProps {
  projectId: string;
  contentItems: ContentItem[];
  isLoading?: boolean;
}
export const ContentItemsCard: React.FC<ContentItemsCardProps> = ({
  projectId,
  contentItems,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    theme
  } = useTheme();
  const isDark = theme === 'dark';
  return <Card className={isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-xl flex justify-between items-center ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          <span>Content Items</span>
          
        </CardTitle>
        <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Manage your educational content items
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div> : <ContentItemsList contentItems={contentItems} projectId={projectId} />}
      </CardContent>
    </Card>;
};