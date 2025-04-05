
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const NewProjectButton = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/projects/new">
            <Button className="gap-2 bg-brand-500 hover:bg-brand-600 transition-all duration-300">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create a new educational content project</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
