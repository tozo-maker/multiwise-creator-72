
import React, { useRef, useEffect, useCallback } from 'react';
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

export const MobileAccessibleNavigation: React.FC = () => {
  const location = useLocation();
  const { isDark } = useTheme();
  const navRef = useRef<HTMLElement>(null);
  
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

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const items = navRef.current?.querySelectorAll('[role="menuitem"]');
    if (!items || items.length === 0) return;

    const currentIndex = Array.from(items).findIndex(
      item => item === document.activeElement
    );

    let nextIndex: number;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = currentIndex + 1 >= items.length ? 0 : currentIndex + 1;
        (items[nextIndex] as HTMLElement).focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = currentIndex - 1 < 0 ? items.length - 1 : currentIndex - 1;
        (items[nextIndex] as HTMLElement).focus();
        break;
      case 'Home':
        e.preventDefault();
        (items[0] as HTMLElement).focus();
        break;
      case 'End':
        e.preventDefault();
        (items[items.length - 1] as HTMLElement).focus();
        break;
    }
  }, []);

  // Focus first item when navigation opens
  useEffect(() => {
    const firstItem = navRef.current?.querySelector('[role="menuitem"]');
    if (firstItem) {
      (firstItem as HTMLElement).focus();
    }
  }, []);

  return (
    <nav 
      className="space-y-1 px-2" 
      aria-label="Mobile Navigation"
      role="navigation"
      ref={navRef}
      onKeyDown={handleKeyDown}
    >
      <div role="menu" aria-orientation="vertical">
        {mainNavItems.map((item, i) => (
          <SheetClose asChild key={i}>
            <Link
              to={item.to}
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-md transition-colors",
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
              tabIndex={0}
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
      </div>
    </nav>
  );
};
