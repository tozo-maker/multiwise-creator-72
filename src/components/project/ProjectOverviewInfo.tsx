
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarClock } from 'lucide-react';

interface ProjectOverviewInfoProps {
  project: {
    progress: number;
    description: string;
    deadline: string;
    lastModified: string;
    owner: string;
  };
}

export const ProjectOverviewInfo: React.FC<ProjectOverviewInfoProps> = ({ project }) => {
  return (
    <Card className="md:col-span-2 border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress bar section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{project.progress}% Complete</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Target: 100%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          
          {/* Project metadata */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2 text-sm pt-2">
            <div className="text-slate-500 dark:text-slate-400 font-medium">Description</div>
            <div className="text-slate-800 dark:text-slate-200">{project.description}</div>
            
            <div className="text-slate-500 dark:text-slate-400 font-medium">Deadline</div>
            <div className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <CalendarClock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              {project.deadline}
            </div>
            
            <div className="text-slate-500 dark:text-slate-400 font-medium">Last modified</div>
            <div className="text-slate-800 dark:text-slate-200">{project.lastModified}</div>
            
            <div className="text-slate-500 dark:text-slate-400 font-medium">Owner</div>
            <div className="text-slate-800 dark:text-slate-200">{project.owner}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
