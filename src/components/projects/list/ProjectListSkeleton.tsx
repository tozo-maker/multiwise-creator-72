
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/contexts/ThemeContext';

export const ProjectListSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-6">
        <Skeleton className={`h-10 w-32 ${
          theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
        }`} />
        <Skeleton className={`h-10 w-32 ml-auto ${
          theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
        }`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className={`h-64 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
          }`} />
        ))}
      </div>
    </div>
  );
};
