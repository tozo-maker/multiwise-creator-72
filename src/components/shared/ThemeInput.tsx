
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
}

export const ThemeInput = React.forwardRef<HTMLInputElement, ThemeInputProps>(
  ({ 
    label, 
    description, 
    error, 
    wrapperClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    className,
    id,
    ...props 
  }, ref) => {
    const { isDark } = useTheme();
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        {label && (
          <Label 
            htmlFor={inputId}
            className={cn(
              isDark ? "text-slate-200" : "text-slate-900",
              labelClassName
            )}
          >
            {label}
          </Label>
        )}
        
        <Input
          ref={ref}
          id={inputId}
          className={cn(
            isDark 
              ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-brand-500 focus:ring-brand-500/20" 
              : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-brand-500/20",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error 
              ? `${inputId}-error` 
              : description 
                ? `${inputId}-description` 
                : undefined
          }
          {...props}
        />
        
        {description && !error && (
          <p 
            id={`${inputId}-description`}
            className={cn(
              "text-sm text-slate-500 dark:text-slate-400",
              descriptionClassName
            )}
          >
            {description}
          </p>
        )}
        
        {error && (
          <p 
            id={`${inputId}-error`}
            className={cn(
              "text-sm text-destructive font-medium",
              errorClassName
            )}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

ThemeInput.displayName = 'ThemeInput';
