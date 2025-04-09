
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeBaseCategories, KBCategory } from './KnowledgeBaseCategories';
import { KnowledgeBaseUpload } from './KnowledgeBaseUpload';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/contexts/ThemeContext';

interface KnowledgeBaseSidebarProps {
  categories: KBCategory[];
  isLoading: boolean;
  activeCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onAddCategory: () => void;
  onFilesUploaded: (files: { file: File, description: string }[]) => void;
}

export const KnowledgeBaseSidebar: React.FC<KnowledgeBaseSidebarProps> = ({
  categories,
  isLoading,
  activeCategory,
  onSelectCategory,
  onAddCategory,
  onFilesUploaded
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
        <CardHeader className="pb-3">
          <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <KnowledgeBaseCategories 
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={onSelectCategory}
              onAddCategory={onAddCategory}
            />
          )}
        </CardContent>
      </Card>
      
      <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
        <CardHeader className="pb-3">
          <CardTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <KnowledgeBaseUpload onFilesUploaded={onFilesUploaded} />
        </CardContent>
      </Card>
    </div>
  );
};
