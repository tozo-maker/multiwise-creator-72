
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronRight, FileText, FileBox, AlertCircle } from 'lucide-react';

interface ProjectResourcesProps {
  projectId: string;
}

export const ProjectResources: React.FC<ProjectResourcesProps> = ({ projectId }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Project Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Content Section */}
        <Card className="border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Content</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0">
                    <Link to={`/projects/${projectId}/content`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to Content</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1 pb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Create and manage educational content for your project.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link to={`/projects/${projectId}/content/new`}>
                <span>Create New Content</span>
                <FileText className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Knowledge Base */}
        <Card className="border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Knowledge Base</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0">
                    <Link to={`/projects/${projectId}/knowledge-base`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to Knowledge Base</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1 pb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Manage reference materials and context files for your project.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link to={`/projects/${projectId}/knowledge-base`}>
                <span>Manage Knowledge Base</span>
                <FileBox className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Snapshots */}
        <Card className="border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Snapshots</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0">
                    <Link to={`/projects/${projectId}/snapshots`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to Snapshots</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1 pb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              View and restore previous versions of your project content.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link to={`/projects/${projectId}/snapshots`}>
                <span>View Snapshots</span>
                <AlertCircle className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
