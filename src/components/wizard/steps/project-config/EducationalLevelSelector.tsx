
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Plus, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EducationalLevelSelectorProps {
  levels: string[];
  onLevelsChange: (levels: string[]) => void;
}

export const EducationalLevelSelector: React.FC<EducationalLevelSelectorProps> = ({
  levels,
  onLevelsChange
}) => {
  const [newLevel, setNewLevel] = useState('');

  const addLevel = () => {
    if (newLevel.trim() !== '' && !levels.includes(newLevel.trim())) {
      onLevelsChange([...levels, newLevel.trim()]);
      setNewLevel('');
    }
  };

  const removeLevel = (level: string) => {
    onLevelsChange(levels.filter(l => l !== level));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="levels">Educational Levels</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-slate-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-80">The educational levels targeted by your content</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex gap-2">
        <Input 
          id="newLevel" 
          value={newLevel}
          onChange={(e) => setNewLevel(e.target.value)}
          placeholder="Add an educational level"
          className="flex-1"
        />
        <Button 
          variant="outline" 
          size="icon"
          onClick={addLevel}
          disabled={newLevel.trim() === ''}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {levels.length === 0 && (
          <div className="text-sm text-slate-500">No levels added yet</div>
        )}
        {levels.map((level, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {level}
            <button 
              onClick={() => removeLevel(level)}
              className="ml-1 text-slate-400 hover:text-slate-700"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
