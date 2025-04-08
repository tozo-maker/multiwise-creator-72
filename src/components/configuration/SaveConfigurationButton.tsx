
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SaveConfigurationButtonProps {
  onSave: () => void;
}

export const SaveConfigurationButton: React.FC<SaveConfigurationButtonProps> = ({ onSave }) => {
  const { toast } = useToast();
  
  const handleSaveChanges = () => {
    onSave();
    toast({
      title: "Changes saved",
      description: "Project configuration has been updated successfully."
    });
  };

  return (
    <Button onClick={handleSaveChanges} className="bg-indigo-600 hover:bg-indigo-700 text-white">
      Save Changes
    </Button>
  );
};
