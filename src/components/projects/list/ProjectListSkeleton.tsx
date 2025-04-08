
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ProjectListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32 ml-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    </div>
  );
};
