
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
      className="bg-brand-500 hover:bg-brand-600"
    >
      <Plus className="h-4 w-4 mr-2" />
      New Project
    </Button>
  );
};
