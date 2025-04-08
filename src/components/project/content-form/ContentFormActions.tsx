
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ContentFormActionsProps {
  isGenerating: boolean;
  disabled: boolean;
  onGenerate: () => void;
}

export const ContentFormActions: React.FC<ContentFormActionsProps> = ({
  isGenerating,
  disabled,
  onGenerate
}) => {
  return (
    <div className="flex justify-end space-x-3 pt-4">
      <Button variant="outline">
        Save Draft
      </Button>
      <Button
        onClick={onGenerate}
        disabled={isGenerating || disabled}
        className="bg-brand-500 hover:bg-brand-600 gap-2"
      >
        {isGenerating ? (
          <>
            <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
            Generating...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Generate Content
          </>
        )}
      </Button>
    </div>
  );
};
