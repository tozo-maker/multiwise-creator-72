
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Calendar, BookText, Globe } from 'lucide-react';
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
import { toast } from "sonner";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    // Here you would implement actual deletion logic
    // For now, we'll just show a toast message
    toast.success("Project deleted successfully");
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
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
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1 text-slate-700">
              <Globe className="h-3 w-3" />
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project 
              "{name}" and all associated content and files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
