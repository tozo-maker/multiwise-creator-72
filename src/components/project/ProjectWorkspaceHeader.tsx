
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/projects')}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{projectName}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline">{projectType}</Badge>
            <Badge variant="outline">{targetLanguage}</Badge>
          </div>
        </div>
      </div>
      
      <Button variant="outline" size="sm" className="gap-2">
        <Settings className="h-4 w-4" />
        Project Settings
      </Button>
    </div>
  );
};
