
import React from 'react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ThemeCard({ children, className, ...props }: ThemeCardProps) {
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
