
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export const ProjectCalendar = () => {
  return (
    <Card className="border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-800/30 transition-shadow dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          Activity Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Activity calendar coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
