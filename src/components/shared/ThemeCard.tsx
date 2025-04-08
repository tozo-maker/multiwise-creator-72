
import React from 'react';
import { Card, CardProps } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export function ThemeCard({ children, className, ...props }: CardProps) {
  const { isDark } = useTheme();
  
  return (
    <Card 
      className={cn(
        isDark 
          ? "border-slate-700 bg-slate-800/50 shadow-lg" 
          : "border-slate-200 bg-white shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
