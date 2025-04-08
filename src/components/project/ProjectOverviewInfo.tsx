
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarClock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Card className={`md:col-span-2 ${
      isDark 
        ? 'bg-slate-800 border-slate-700' 
        : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-xl ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}>Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress bar section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>{project.progress}% Complete</span>
              <span className={`text-xs ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>Target: 100%</span>
            </div>
            <Progress value={project.progress} className={`h-2 ${
              isDark ? 'bg-slate-700' : 'bg-slate-100'
            }`} />
          </div>
          
          {/* Project metadata */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2 text-sm pt-2">
            <div className={`font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>Description</div>
            <div className={
              isDark ? 'text-slate-200' : 'text-slate-700'
            }>{project.description}</div>
            
            <div className={`font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>Deadline</div>
            <div className={`flex items-center gap-2 ${
              isDark ? 'text-slate-200' : 'text-slate-700'
            }`}>
              <CalendarClock className={`h-3.5 w-3.5 ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`} />
              {project.deadline}
            </div>
            
            <div className={`font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>Last modified</div>
            <div className={
              isDark ? 'text-slate-200' : 'text-slate-700'
            }>{project.lastModified}</div>
            
            <div className={`font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>Owner</div>
            <div className={
              isDark ? 'text-slate-200' : 'text-slate-700'
            }>{project.owner}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
