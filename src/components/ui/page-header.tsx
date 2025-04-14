
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  heading: string;
  subheading?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  heading,
  subheading,
  children,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <h1 className="text-3xl font-bold tracking-tight dark:text-white">{heading}</h1>
      {subheading && (
        <p className="text-muted-foreground dark:text-slate-400">{subheading}</p>
      )}
      {children}
    </div>
  );
};
