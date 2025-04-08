
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delay?: number;
  className?: string;
  contentClassName?: string;
}

export function ThemeTooltip({
  children,
  content,
  side = "top",
  align = "center",
  delay = 200,
  className,
  contentClassName
}: ThemeTooltipProps) {
  const { isDark } = useTheme();
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delay}>
        <TooltipTrigger asChild className={className}>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className={cn(
            isDark 
              ? "bg-slate-800 text-slate-100 border-slate-700" 
              : "bg-white text-slate-900 border-slate-200",
            contentClassName
          )}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
