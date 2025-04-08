
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ThemeButton({
  children,
  variant = 'primary',
  size = 'default',
  className,
  ...props
}: ThemeButtonProps) {
  const { isDark } = useTheme();
  
  // Map our semantic variants to appropriate styling based on theme
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return isDark
          ? "bg-indigo-600 hover:bg-indigo-500 text-white"
          : "bg-indigo-600 hover:bg-indigo-500 text-white";
          
      case 'secondary':
        return isDark
          ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
          : "bg-slate-200 hover:bg-slate-300 text-slate-800";
          
      case 'outline':
        return isDark
          ? "border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          : "border-slate-200 text-slate-700 hover:bg-slate-50 bg-transparent";
          
      case 'ghost':
        return isDark
          ? "text-slate-300 hover:bg-slate-800 hover:text-slate-100 bg-transparent"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 bg-transparent";
          
      case 'destructive':
        return isDark
          ? "bg-red-600 hover:bg-red-500 text-white"
          : "bg-red-600 hover:bg-red-500 text-white";
          
      default:
        return "";
    }
  };

  return (
    <Button
      className={cn(getVariantClasses(), className)}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
}
