
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

interface ThemeNavigationMenuProps {
  children: React.ReactNode;
  className?: string;
}

export function ThemeNavigationMenu({ 
  children, 
  className 
}: ThemeNavigationMenuProps) {
  const { isDark } = useTheme();
  
  return (
    <NavigationMenu 
      className={cn(
        isDark ? "bg-slate-800 text-slate-100" : "bg-white text-slate-900",
        className
      )}
    >
      <NavigationMenuList>{children}</NavigationMenuList>
    </NavigationMenu>
  );
}

export const ThemeNavigationMenuItem = NavigationMenuItem;

export function ThemeNavigationMenuTrigger({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const { isDark } = useTheme();
  
  return (
    <NavigationMenuTrigger 
      className={cn(
        navigationMenuTriggerStyle(),
        isDark 
          ? "bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-slate-100 data-[state=open]:bg-slate-700" 
          : "bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-900 data-[state=open]:bg-slate-100",
        className
      )}
    >
      {children}
    </NavigationMenuTrigger>
  );
}

export function ThemeNavigationMenuContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const { isDark } = useTheme();
  
  return (
    <NavigationMenuContent 
      className={cn(
        isDark 
          ? "bg-slate-800 border border-slate-700 text-slate-100" 
          : "bg-white border border-slate-200 text-slate-900",
        className
      )}
    >
      {children}
    </NavigationMenuContent>
  );
}

export function ThemeNavigationMenuLink({ 
  children, 
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof NavigationMenuLink>) {
  const { isDark } = useTheme();
  
  return (
    <NavigationMenuLink 
      className={cn(
        navigationMenuTriggerStyle(),
        isDark 
          ? "bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-slate-100" 
          : "bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-900",
        className
      )}
      {...props}
    >
      {children}
    </NavigationMenuLink>
  );
}
