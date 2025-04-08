
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ViewAllProjectsButtonProps {
  projectCount: number;
}

export const ViewAllProjectsButton: React.FC<ViewAllProjectsButtonProps> = ({ projectCount }) => {
  const navigate = useNavigate();
  
  return (
    <div className="col-span-full mt-6 text-center">
      <Button 
        variant="outline" 
        className="border-dashed border-slate-300 transition-all hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600"
        onClick={() => navigate('/projects')}
      >
        View all {projectCount} projects
      </Button>
    </div>
  );
};
