
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectWorkspaceHeaderProps {
  projectName: string;
  projectType: string;
  targetLanguage: string;
}

export const ProjectWorkspaceHeader: React.FC<ProjectWorkspaceHeaderProps> = ({
  projectName,
  projectType,
  targetLanguage
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/projects')}
              className={`h-8 w-8 ${
                isDark
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to Projects</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Back to Projects</p>
          </TooltipContent>
        </Tooltip>
        
        <div>
          <h1 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>{projectName}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline" className={
              isDark
                ? "bg-slate-800 text-slate-300 border-slate-700"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }>{projectType}</Badge>
            <Badge variant="outline" className={
              isDark
                ? "bg-slate-800 text-slate-300 border-slate-700"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }>{targetLanguage}</Badge>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`gap-2 ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-slate-100'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => navigate(`/projects/${window.location.pathname.split('/')[2]}/configuration`)}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};
