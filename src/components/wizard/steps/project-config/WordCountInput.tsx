
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WordCountInputProps {
  wordCount: number;
  onWordCountChange: (value: number) => void;
}

export const WordCountInput: React.FC<WordCountInputProps> = ({
  wordCount,
  onWordCountChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="wordCount">Target Word Count</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-slate-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-80">Estimated word count for the entire project</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Input 
        id="wordCount" 
        type="number"
        value={wordCount.toString()}
        onChange={(e) => onWordCountChange(parseInt(e.target.value) || 0)}
        min="0"
        step="1000"
      />
    </div>
  );
};
