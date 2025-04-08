
import React from 'react';
import { ModernTopBar } from './ModernTopBar';
import { ModernSidebar } from './ModernSidebar';
import { cn } from '@/lib/utils';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface ModernLayoutProps {
  children: React.ReactNode;
  contentWidth?: 'default' | 'narrow' | 'wide';
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({ 
  children, 
  contentWidth = 'wide' 
}) => {
  const isMobile = useIsMobile();
  
  // Map contentWidth to appropriate max-width classes
  const getMaxWidthClass = () => {
    switch (contentWidth) {
      case 'narrow':
        return 'max-w-4xl';
      case 'default':
        return 'max-w-7xl'; 
      case 'wide':
      default:
        return 'max-w-full px-4 md:px-6';
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex w-full">
        <ModernSidebar />
        
        <DashboardProvider>
          <SidebarInset className="flex flex-col w-full">
            <ModernTopBar />
            <main className="flex-1 overflow-y-auto p-3 md:p-6">
              <div className={cn("mx-auto transition-all", getMaxWidthClass())}>
                {children}
              </div>
            </main>
          </SidebarInset>
        </DashboardProvider>
      </div>
    </SidebarProvider>
  );
};
