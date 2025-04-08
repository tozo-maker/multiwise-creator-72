
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface ThemeRadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeRadioGroup({
  options,
  value,
  onChange,
  name,
  className,
  orientation = 'vertical',
  size = 'md'
}: ThemeRadioGroupProps) {
  const { isDark } = useTheme();
  
  const handleValueChange = (val: string) => {
    onChange(val);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return "gap-2 text-sm";
      case 'lg':
        return "gap-4 text-base";
      case 'md':
      default:
        return "gap-3 text-sm";
    }
  };

  return (
    <RadioGroup
      value={value}
      onValueChange={handleValueChange}
      className={cn(
        "space-y-2",
        orientation === 'horizontal' && "flex flex-row space-y-0 space-x-4",
        className
      )}
      name={name}
    >
      {options.map((option) => (
        <div
          key={option.value}
          className={cn(
            "flex items-start",
            getSizeClasses(),
            option.disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <RadioGroupItem
            value={option.value}
            id={`${name}-${option.value}`}
            disabled={option.disabled}
            className={cn(
              isDark
                ? "border-slate-600 text-slate-200 focus:ring-brand-500"
                : "border-slate-300 text-slate-900 focus:ring-brand-500"
            )}
            aria-describedby={option.description ? `${name}-${option.value}-description` : undefined}
          />
          <div className="space-y-1 leading-none">
            <Label
              htmlFor={`${name}-${option.value}`}
              className={cn(
                isDark ? "text-slate-200" : "text-slate-900",
                option.disabled && "cursor-not-allowed"
              )}
            >
              {option.label}
            </Label>
            {option.description && (
              <p
                id={`${name}-${option.value}-description`}
                className={cn(
                  "text-xs",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}
              >
                {option.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </RadioGroup>
  );
}
