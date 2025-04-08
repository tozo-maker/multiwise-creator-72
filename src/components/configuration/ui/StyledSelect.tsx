
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TooltipLabel } from './TooltipLabel';

interface SelectOption {
  value: string;
  label: string;
}

interface StyledSelectProps {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

export const StyledSelect: React.FC<StyledSelectProps> = ({
  id,
  label,
  tooltip,
  value,
  onChange,
  options
}) => {
  return (
    <div className="space-y-2">
      <TooltipLabel 
        htmlFor={id} 
        label={label} 
        tooltip={tooltip} 
      />
      <Select 
        defaultValue={value}
        onValueChange={onChange}
      >
        <SelectTrigger id={id} className="bg-slate-800 border-slate-600 text-slate-200 w-full">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
