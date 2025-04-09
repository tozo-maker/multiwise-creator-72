
import React from 'react';
import { Link } from 'react-router-dom';
import { BookText, Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/layout/theme/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { MobileUserProfile } from '@/components/layout/MobileUserProfile';
import { useAuth } from '@/contexts/AuthContext';

interface TopBarProps {
  className?: string;
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const TopBar = React.forwardRef<
  HTMLDivElement,
  TopBarProps
>(({ className, toggleSidebar, isSidebarOpen }, ref) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  
  return (
    <div
      ref={ref}
      className={cn(
        'sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 backdrop-blur-sm transition-all duration-100 md:px-6',
        isDark ? 'border-slate-700 bg-slate-900/95' : 'border-slate-200 bg-white/95',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {toggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-brand-500 flex items-center justify-center">
            <BookText className="h-5 w-5 text-white" />
          </div>
          <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} hidden md:inline`}>
            MultiGuide
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8 bg-slate-100 dark:bg-slate-800 border-none focus-visible:ring-offset-0"
          />
        </div>
        
        <ThemeToggle />
        <MobileUserProfile />
      </div>
    </div>
  );
});

TopBar.displayName = 'TopBar';
