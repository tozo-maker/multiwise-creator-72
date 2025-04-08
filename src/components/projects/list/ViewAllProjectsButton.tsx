
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

interface ViewAllProjectsButtonProps {
  projectCount: number;
}

export const ViewAllProjectsButton: React.FC<ViewAllProjectsButtonProps> = ({ projectCount }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  return (
    <div className="col-span-full mt-6 text-center">
      <Button 
        variant="outline" 
        className={`border-dashed transition-all ${
          theme === 'dark'
            ? 'border-slate-700 hover:border-slate-600 text-slate-300'
            : 'border-slate-300 hover:border-slate-400 text-slate-700'
        }`}
        onClick={() => navigate('/projects')}
      >
        View all {projectCount} projects
      </Button>
    </div>
  );
};
