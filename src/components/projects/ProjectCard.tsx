
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
import { motion } from "framer-motion";
import { useTheme } from '@/contexts/ThemeContext';

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
  status?: string;
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
  totalMaterials = 0,
  status = "active"
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();

  const handleDelete = () => {
    // Here you would implement actual deletion logic
    // For now, we'll just show a toast message
    toast.success("Project deleted successfully");
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className={`overflow-hidden hover:shadow-md transition-all duration-300 ${
          theme === 'dark' ? 'dark:bg-slate-800 dark:border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <CardContent className="p-0">
            <div className="relative h-3 w-full bg-slate-100 dark:bg-slate-700">
              <motion.div 
                className="absolute inset-0 bg-brand-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ 
                  duration: 1, 
                  ease: "easeOut",
                  delay: 0.3
                }}
              />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start">
                <Link to={`/projects/${id}`} className="group flex-1">
                  <h3 className={`font-semibold text-lg line-clamp-1 group-hover:text-brand-600 transition-colors ${
                    theme === 'dark' ? 'text-white dark:group-hover:text-brand-400' : 'text-slate-900 group-hover:text-brand-600'
                  }`}>{name}</h3>
                  <p className={`text-sm mt-1 line-clamp-2 ${
                    theme === 'dark' ? 'text-slate-400 dark:text-slate-400' : 'text-slate-500'
                  }`}>{description}</p>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
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
                <Badge variant="outline" className={`flex items-center gap-1 ${
                  theme === 'dark' 
                    ? 'text-slate-300 dark:border-slate-600 dark:bg-slate-700/30' 
                    : 'text-slate-700 border-slate-200 bg-slate-50'
                }`}>
                  <Globe className="h-3 w-3" />
                  {targetLanguage}
                </Badge>
                <Badge variant="outline" className={`flex items-center gap-1 ${
                  theme === 'dark' 
                    ? 'text-slate-300 dark:border-slate-600 dark:bg-slate-700/30' 
                    : 'text-slate-700 border-slate-200 bg-slate-50'
                }`}>
                  <BookText className="h-3 w-3" />
                  {type}
                </Badge>
                
                {status === "archived" && (
                  <Badge variant="outline" className={`flex items-center gap-1 ${
                    theme === 'dark' 
                      ? 'bg-slate-700 text-slate-300' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    Archived
                  </Badge>
                )}
                
                {collaborators > 0 && (
                  <Badge variant="outline" className={`flex items-center gap-1 ${
                    theme === 'dark' 
                      ? 'text-slate-300 dark:border-slate-600 dark:bg-slate-700/30' 
                      : 'text-slate-700 border-slate-200 bg-slate-50'
                  }`}>
                    <Users className="h-3 w-3" />
                    {collaborators} {collaborators === 1 ? 'collaborator' : 'collaborators'}
                  </Badge>
                )}
                {totalMaterials > 0 && (
                  <Badge variant="outline" className={`flex items-center gap-1 ${
                    theme === 'dark' 
                      ? 'text-slate-300 dark:border-slate-600 dark:bg-slate-700/30' 
                      : 'text-slate-700 border-slate-200 bg-slate-50'
                  }`}>
                    <Briefcase className="h-3 w-3" />
                    {totalMaterials} {totalMaterials === 1 ? 'material' : 'materials'}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className={`px-5 py-3 border-t flex justify-between items-center ${
            theme === 'dark' 
              ? 'bg-slate-800/50 border-slate-700 ' 
              : 'bg-slate-50 border-slate-100'
          }`}>
            <div className={`flex items-center gap-1 text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <Clock className="h-3 w-3" />
              <span>Updated {lastModified}</span>
            </div>
            <div className={`text-xs font-medium ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {progress}% Complete
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className={theme === 'dark' ? 'dark:bg-slate-800 dark:border-slate-700' : 'bg-white'}>
          <AlertDialogHeader>
            <AlertDialogTitle className={theme === 'dark' ? 'dark:text-white' : 'text-slate-900'}>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription className={theme === 'dark' ? 'dark:text-slate-400' : 'text-slate-600'}>
              This action cannot be undone. This will permanently delete the project 
              "{name}" and all associated content and files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={theme === 'dark' ? 'dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' : 'bg-slate-100'}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
