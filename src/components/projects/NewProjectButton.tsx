
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NewProjectButton = () => {
  return (
    <Link to="/projects/new">
      <Button className="gap-2 bg-brand-500 hover:bg-brand-600">
        <Plus className="h-4 w-4" />
        New Project
      </Button>
    </Link>
  );
};
