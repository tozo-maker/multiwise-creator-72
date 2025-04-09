
import React, { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export const ChartCard = ({
  title,
  description,
  icon,
  children
}: ChartCardProps) => {
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-800/30 transition-shadow">
      <CardHeader>
        <CardTitle className="dark:text-white flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="dark:text-slate-400">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pl-2">
        {children}
      </CardContent>
    </Card>
  );
};
