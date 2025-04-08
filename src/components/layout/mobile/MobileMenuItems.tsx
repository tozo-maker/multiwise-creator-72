
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookText, FolderPlus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SheetClose } from '@/components/ui/sheet';
import { useTheme } from '@/contexts/ThemeContext';

interface MobileMenuItem {
  icon: React.ReactNode;
  text: string;
  to: string;
  ariaLabel?: string;
}

export const MobileMenuItems: React.FC = () => {
  const location = useLocation();
  const { isDark } = useTheme();
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  const mainNavItems: MobileMenuItem[] = [
    { 
      icon: <Home className="h-5 w-5" aria-hidden="true" />, 
      text: "Dashboard", 
      to: "/dashboard",
      ariaLabel: "Navigate to Dashboard"
    },
    { 
      icon: <BookText className="h-5 w-5" aria-hidden="true" />, 
      text: "Projects", 
      to: "/projects",
      ariaLabel: "Navigate to Projects"
    },
    { 
      icon: <FolderPlus className="h-5 w-5" aria-hidden="true" />, 
      text: "New Project", 
      to: "/projects/new",
      ariaLabel: "Create New Project"
    },
    { 
      icon: <Settings className="h-5 w-5" aria-hidden="true" />, 
      text: "Settings", 
      to: "/settings",
      ariaLabel: "Navigate to Settings"
    },
  ];

  return (
    <nav className="space-y-1 px-2" aria-label="Main Navigation">
      {mainNavItems.map((item, i) => (
        <SheetClose asChild key={i}>
          <Link
            to={item.to}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
              isActive(item.to) 
                ? isDark
                  ? "bg-slate-700 text-white font-medium" 
                  : "bg-brand-50 text-brand-700 font-medium" 
                : isDark
                  ? "text-slate-300 hover:text-white hover:bg-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
            aria-current={isActive(item.to) ? "page" : undefined}
            aria-label={item.ariaLabel || item.text}
            role="menuitem"
          >
            <span className={cn(
              isActive(item.to) 
                ? isDark
                  ? "text-white" 
                  : "text-brand-600"
                : isDark
                  ? "text-slate-400" 
                  : "text-slate-500"
            )}>
              {item.icon}
            </span>
            <span>{item.text}</span>
          </Link>
        </SheetClose>
      ))}
    </nav>
  );
};
