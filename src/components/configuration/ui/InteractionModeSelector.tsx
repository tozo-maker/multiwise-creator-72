
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TooltipLabel } from './TooltipLabel';

interface InteractionModeOption {
  value: string;
  label: string;
  description: string;
}

interface InteractionModeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: InteractionModeOption[];
}

export const InteractionModeSelector: React.FC<InteractionModeSelectorProps> = ({
  value,
  onChange,
  options
}) => {
  return (
    <div className="space-y-2">
      <TooltipLabel 
        label="Interaction Mode" 
        tooltip="How you prefer to interact with the system" 
      />
      <RadioGroup 
        defaultValue={value} 
        onValueChange={onChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {options.map((option) => (
          <div 
            key={option.value}
            className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer"
          >
            <RadioGroupItem value={option.value} id={option.value.toLowerCase()} />
            <div>
              <Label 
                htmlFor={option.value.toLowerCase()} 
                className="font-medium text-slate-200 cursor-pointer"
              >
                {option.label}
              </Label>
              <p className="text-xs text-slate-400 mt-1">{option.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
