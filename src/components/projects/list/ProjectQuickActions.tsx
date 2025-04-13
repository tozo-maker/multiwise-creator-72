
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  LineChart, 
  Edit, 
  Archive, 
  BookOpen, 
  Database, 
  MoreHorizontal 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProjectCardProps } from '../ProjectCard';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { ProjectService } from '@/services/ProjectService';

interface ProjectQuickActionsProps {
  project: ProjectCardProps;
  onActionComplete?: () => void;
  size?: 'default' | 'compact';
}

export const ProjectQuickActions: React.FC<ProjectQuickActionsProps> = ({
  project,
  onActionComplete,
  size = 'default'
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleArchiveProject = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await ProjectService.updateStatus(project.id, 'archived');
      toast({
        title: "Project archived",
        description: `${project.name} has been archived.`
      });
      if (onActionComplete) onActionComplete();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to archive",
        description: error.message || "Could not archive project."
      });
    }
  };
  
  const navigateToContent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/projects/${project.id}/content`);
  };
  
  const navigateToAnalysis = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/projects/${project.id}/analysis`);
  };
  
  const navigateToKnowledgeBase = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/projects/${project.id}/knowledge-base`);
  };
  
  const navigateToEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/projects/${project.id}/configuration`);
  };
  
  if (size === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Project actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={navigateToContent}>
            <FileText className="mr-2 h-4 w-4" /> 
            Manage Content
          </DropdownMenuItem>
          <DropdownMenuItem onClick={navigateToKnowledgeBase}>
            <Database className="mr-2 h-4 w-4" /> 
            Knowledge Base
          </DropdownMenuItem>
          <DropdownMenuItem onClick={navigateToAnalysis}>
            <LineChart className="mr-2 h-4 w-4" /> 
            Analysis
          </DropdownMenuItem>
          <DropdownMenuItem onClick={navigateToEdit}>
            <Edit className="mr-2 h-4 w-4" /> 
            Edit Project
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleArchiveProject} className="text-red-500">
            <Archive className="mr-2 h-4 w-4" /> 
            Archive Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={navigateToContent}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" />
        <span className="hidden md:inline">Content</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={navigateToKnowledgeBase}
        className="flex items-center gap-1"
      >
        <BookOpen className="h-4 w-4" />
        <span className="hidden md:inline">Knowledge</span>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={navigateToAnalysis}>
            <LineChart className="mr-2 h-4 w-4" /> 
            Analysis
          </DropdownMenuItem>
          <DropdownMenuItem onClick={navigateToEdit}>
            <Edit className="mr-2 h-4 w-4" /> 
            Edit Project
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleArchiveProject} className="text-red-500">
            <Archive className="mr-2 h-4 w-4" /> 
            Archive Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
