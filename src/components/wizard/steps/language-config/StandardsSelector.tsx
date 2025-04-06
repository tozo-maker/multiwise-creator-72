
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Plus, X, FileUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';

interface StandardsSelectorProps {
  standards: string[];
  customStandards?: string[];
  onStandardsChange: (standards: string[]) => void;
  onCustomStandardsChange: (customStandards: string[]) => void;
}

export const StandardsSelector: React.FC<StandardsSelectorProps> = ({
  standards,
  customStandards = [],
  onStandardsChange,
  onCustomStandardsChange
}) => {
  const [newStandard, setNewStandard] = useState('');

  const addCustomStandard = () => {
    if (newStandard.trim() !== '' && !customStandards.includes(newStandard.trim())) {
      onCustomStandardsChange([...customStandards, newStandard.trim()]);
      setNewStandard('');
    }
  };

  const removeCustomStandard = (standard: string) => {
    onCustomStandardsChange(customStandards.filter(s => s !== standard));
  };

  const toggleStandard = (standard: string, isChecked: boolean) => {
    if (isChecked) {
      onStandardsChange([...standards, standard]);
    } else {
      onStandardsChange(standards.filter(s => s !== standard));
    }
  };

  const predefinedStandards = [
    { id: 'ccss', name: 'Common Core State Standards (US)' },
    { id: 'ngss', name: 'Next Generation Science Standards (US)' },
    { id: 'ib', name: 'International Baccalaureate' },
    { id: 'cambridge', name: 'Cambridge IGCSE & A-Levels' },
    { id: 'actfl', name: 'ACTFL (Language)' },
    { id: 'cefr', name: 'CEFR (European Language Framework)' },
    { id: 'australian', name: 'Australian Curriculum' },
    { id: 'uk-natcurric', name: 'UK National Curriculum' },
    { id: 'ap', name: 'Advanced Placement (AP)' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-base font-medium">Standards Alignment</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-slate-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-80">Educational standards to align your content with</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        {predefinedStandards.map((standard) => (
          <div key={standard.id} className="flex items-center space-x-2">
            <Checkbox
              id={standard.id}
              checked={standards.includes(standard.id)}
              onCheckedChange={(checked) => toggleStandard(standard.id, checked === true)}
            />
            <Label
              htmlFor={standard.id}
              className="text-sm font-normal cursor-pointer"
            >
              {standard.name}
            </Label>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mt-4">
        <Label className="text-base font-medium">Custom Standards</Label>
        <div className="flex gap-2 mt-2">
          <Input 
            value={newStandard}
            onChange={(e) => setNewStandard(e.target.value)}
            placeholder="Add a custom standard..."
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={addCustomStandard}
            disabled={newStandard.trim() === ''}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {customStandards.length === 0 && (
            <div className="text-sm text-slate-500">No custom standards added</div>
          )}
          {customStandards.map((standard, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1 pl-3 pr-2 py-1.5">
              {standard}
              <button 
                onClick={() => removeCustomStandard(standard)}
                className="ml-1 text-slate-400 hover:text-slate-700"
                aria-label={`Remove ${standard}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <FileUp className="h-4 w-4" />
            <span>Upload Standards Document</span>
          </Button>
          <div className="text-xs text-muted-foreground">
            Upload documents containing custom standards requirements
          </div>
        </div>
      </div>
    </div>
  );
};
