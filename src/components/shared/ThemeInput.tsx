
import React from 'react';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

export const ThemeInput = React.forwardRef<HTMLInputElement, ThemeInputProps>(
  ({ className, error, helperText, ...props }, ref) => {
    const { isDark } = useTheme();
    
    return (
      <div className="space-y-1">
        <Input
          ref={ref}
          className={cn(
            isDark
              ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-brand-500 focus:border-brand-500"
              : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-brand-500 focus:border-brand-500",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
          {...props}
          aria-invalid={error}
          aria-describedby={helperText ? `${props.id}-helper-text` : undefined}
        />
        {helperText && (
          <p 
            id={`${props.id}-helper-text`}
            className={cn(
              "text-xs",
              error 
                ? "text-red-500" 
                : isDark 
                  ? "text-slate-400" 
                  : "text-slate-500"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
ThemeInput.displayName = "ThemeInput";
