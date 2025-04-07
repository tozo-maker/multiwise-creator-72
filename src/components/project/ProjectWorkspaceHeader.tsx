
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/projects')}
              className="h-8 w-8 text-slate-600 hover:text-slate-900"
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
          <h1 className="text-2xl font-bold text-slate-900">{projectName}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline" className="bg-slate-50 text-slate-700">{projectType}</Badge>
            <Badge variant="outline" className="bg-slate-50 text-slate-700">{targetLanguage}</Badge>
          </div>
        </div>
      </div>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => navigate(`/projects/${window.location.pathname.split('/')[2]}/configuration`)}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Manage project settings</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
