
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ThemeSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  description?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  required?: boolean;
}

export const ThemeSelect: React.FC<ThemeSelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  description,
  error,
  className,
  disabled,
  id,
  required = false,
}) => {
  const { isDark } = useTheme();
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  
  const handleValueChange = (newValue: string) => {
    if (onChange) onChange(newValue);
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <Label 
          htmlFor={selectId}
          className={cn(
            isDark ? "text-slate-200" : "text-slate-900",
            required && "after:content-['*'] after:ml-0.5 after:text-destructive"
          )}
        >
          {label}
        </Label>
      )}
      
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={selectId}
          className={cn(
            isDark 
              ? "bg-slate-800 border-slate-700 text-white data-[placeholder]:text-slate-400" 
              : "bg-white border-slate-200 text-slate-900 data-[placeholder]:text-slate-400",
            error && "border-destructive focus-visible:ring-destructive/20",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error 
              ? `${selectId}-error` 
              : description 
                ? `${selectId}-description` 
                : undefined
          }
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        
        <SelectContent
          position="popper"
          className={isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}
        >
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
              className={isDark ? "text-slate-200 focus:bg-slate-700 focus:text-white" : ""}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {description && !error && (
        <p 
          id={`${selectId}-description`}
          className="text-sm text-slate-500 dark:text-slate-400"
        >
          {description}
        </p>
      )}
      
      {error && (
        <p 
          id={`${selectId}-error`}
          className="text-sm text-destructive font-medium"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};
