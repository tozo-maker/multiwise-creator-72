
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TooltipLabel } from './TooltipLabel';

interface ExperienceLevelOption {
  value: string;
  label: string;
  description: string;
}

interface ExperienceLevelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: ExperienceLevelOption[];
}

export const ExperienceLevelSelector: React.FC<ExperienceLevelSelectorProps> = ({
  value,
  onChange,
  options
}) => {
  return (
    <div className="space-y-2">
      <TooltipLabel 
        label="User Experience Level" 
        tooltip="Your level of experience with educational content creation" 
      />
      <RadioGroup 
        defaultValue={value} 
        onValueChange={onChange}
        className="grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        {options.map((option) => (
          <div 
            key={option.value}
            className="flex flex-col bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value.toLowerCase()} />
              <Label 
                htmlFor={option.value.toLowerCase()} 
                className="font-medium text-slate-200 cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
            <p className="text-xs text-slate-400 mt-1">{option.description}</p>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
