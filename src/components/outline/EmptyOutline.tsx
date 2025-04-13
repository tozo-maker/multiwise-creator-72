
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Sparkles, FileUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface EmptyOutlineProps {
  onCreateOutline: () => void;
  onGenerateAIOutline: () => void;
  isCreating: boolean;
}

export const EmptyOutline: React.FC<EmptyOutlineProps> = ({
  onCreateOutline,
  onGenerateAIOutline,
  isCreating
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Card className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}>
      <CardContent className="p-8 flex flex-col items-center justify-center">
        <div className={`rounded-full p-4 mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <FileUp size={32} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          No Outline Created Yet
        </h3>
        <p className={`text-center max-w-md mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Create a project outline to organize your content structure. An outline helps you plan and track your content creation progress.
        </p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onCreateOutline}
            disabled={isCreating}
            className="gap-2"
          >
            <PlusCircle size={16} />
            Create Manually
          </Button>
          <Button
            variant="default"
            onClick={onGenerateAIOutline}
            disabled={isCreating}
            className="gap-2"
          >
            <Sparkles size={16} />
            Generate with AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
