
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NewProjectButton = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/projects/new');
  };
  
  return (
    <Button 
      onClick={handleClick}
      className="bg-brand-500 hover:bg-brand-600 text-white flex items-center gap-2"
      size="sm"
    >
      <Plus className="h-4 w-4" />
      <span className="hidden sm:inline">New Project</span>
    </Button>
  );
};
