
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Calendar, BookText, Globe, Users, Briefcase, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

export interface ProjectCardProps {
  id: string;
  name: string;
  targetLanguage: string;
  type: string;
  lastModified: string;
  progress: number;
  description?: string;
  collaborators?: number;
  totalMaterials?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  targetLanguage,
  type,
  lastModified,
  progress,
  description = "No description provided for this project",
  collaborators = 0,
  totalMaterials = 0
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    // Here you would implement actual deletion logic
    // For now, we'll just show a toast message
    toast.success("Project deleted successfully");
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700">
        <CardContent className="p-0">
          <div className="relative h-3 w-full">
            <div 
              className="absolute inset-0 bg-brand-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="p-5">
            <div className="flex justify-between items-start">
              <Link to={`/projects/${id}`} className="group">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{description}</p>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-700 dark:text-slate-300">
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
                  <DropdownMenuItem 
                    className="text-red-600 dark:text-red-400"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1 text-slate-700 dark:text-slate-300 dark:border-slate-600 dark:bg-slate-700/30">
                <Globe className="h-3 w-3" />
                {targetLanguage}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-slate-700 dark:text-slate-300 dark:border-slate-600 dark:bg-slate-700/30">
                <BookText className="h-3 w-3" />
                {type}
              </Badge>
              {collaborators > 0 && (
                <Badge variant="outline" className="flex items-center gap-1 text-slate-700 dark:text-slate-300 dark:border-slate-600 dark:bg-slate-700/30">
                  <Users className="h-3 w-3" />
                  {collaborators} {collaborators === 1 ? 'collaborator' : 'collaborators'}
                </Badge>
              )}
              {totalMaterials > 0 && (
                <Badge variant="outline" className="flex items-center gap-1 text-slate-700 dark:text-slate-300 dark:border-slate-600 dark:bg-slate-700/30">
                  <Briefcase className="h-3 w-3" />
                  {totalMaterials} {totalMaterials === 1 ? 'material' : 'materials'}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="h-3 w-3" />
            <span>Updated {lastModified}</span>
          </div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {progress}% Complete
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-slate-800 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-slate-400">
              This action cannot be undone. This will permanently delete the project 
              "{name}" and all associated content and files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
