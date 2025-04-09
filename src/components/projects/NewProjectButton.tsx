
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NewProjectButtonProps {
  className?: string;
}

export const NewProjectButton: React.FC<NewProjectButtonProps> = ({ className }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Navigate to the project creation page (fixed path)
    navigate('/projects/create');
  };
  
  return (
    <Button 
      onClick={handleClick}
      className={cn("bg-brand-500 hover:bg-brand-600 text-white dark:text-white flex items-center gap-2", className)}
      size="sm"
    >
      <Plus className="h-4 w-4" />
      <span className="hidden sm:inline">New Project</span>
    </Button>
  );
};
