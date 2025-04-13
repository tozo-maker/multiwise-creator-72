
import React from 'react';
import { ModernTopBar } from './ModernTopBar';
import { ModernSidebar } from './ModernSidebar';
import { cn } from '@/lib/utils';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';

interface ModernLayoutProps {
  children: React.ReactNode;
  contentWidth?: 'default' | 'narrow' | 'wide';
  mainId?: string;
  ariaLabel?: string;
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({ 
  children, 
  contentWidth = 'wide',
  mainId = 'main-content',
  ariaLabel = 'Main content'
}) => {
  const isMobile = useIsMobile();
  const { isDark } = useTheme();
  
  // Map contentWidth to appropriate max-width classes
  const getMaxWidthClass = () => {
    switch (contentWidth) {
      case 'narrow':
        return 'max-w-4xl';
      case 'default':
        return 'max-w-7xl'; 
      case 'wide':
      default:
        return 'max-w-full'; // Use full width for wide content
    }
  };

  // Read sidebar state from localStorage on initial load
  const defaultSidebarState = () => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebar-state');
      
      // On mobile, sidebar should be closed by default
      if (isMobile) {
        return false;
      }
      
      return savedState === 'closed' ? false : true;
    }
    return !isMobile;
  };

  return (
    <SidebarProvider defaultOpen={defaultSidebarState()}>
      <div className={cn(
        "min-h-screen flex w-full",
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'
      )}>
        <ModernSidebar />
        
        <SidebarInset className="flex flex-col w-full">
          <ModernTopBar />
          <main 
            id={mainId}
            className={cn(
              "flex-1 overflow-y-auto p-3 md:p-6 w-full",
              isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
            )}
            role="main"
            aria-label={ariaLabel}
            tabIndex={-1}
          >
            <div className={cn("mx-auto transition-all px-4 md:px-6", getMaxWidthClass())}>
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
