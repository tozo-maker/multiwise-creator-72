
import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Calendar, Translate, BookText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface ProjectCardProps {
  id: string;
  name: string;
  targetLanguage: string;
  type: string;
  lastModified: string;
  progress: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  targetLanguage,
  type,
  lastModified,
  progress
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <Link to={`/projects/${id}`} className="hover:underline">
            <h3 className="font-semibold text-lg text-slate-900 line-clamp-1">{name}</h3>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to={`/projects/${id}`} className="flex w-full">Open Project</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/projects/${id}/configuration`} className="flex w-full">Edit Configuration</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/projects/${id}/knowledge-base`} className="flex w-full">Manage Knowledge Base</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete Project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1 text-slate-700">
            <Translate className="h-3 w-3" />
            {targetLanguage}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 text-slate-700">
            <BookText className="h-3 w-3" />
            {type}
          </Badge>
        </div>
      </div>
      
      <div className="px-5 pb-4">
        <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {lastModified}
          </div>
          <span>{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
    </div>
  );
};
