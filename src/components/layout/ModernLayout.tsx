
import React from 'react';
import { ModernTopBar } from './ModernTopBar';
import { ModernSidebar } from './ModernSidebar';
import { cn } from '@/lib/utils';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface ModernLayoutProps {
  children: React.ReactNode;
  contentWidth?: 'default' | 'narrow' | 'wide';
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({ 
  children, 
  contentWidth = 'wide' 
}) => {
  // Map contentWidth to appropriate max-width classes
  const getMaxWidthClass = () => {
    switch (contentWidth) {
      case 'narrow':
        return 'max-w-4xl';
      case 'default':
        return 'max-w-7xl'; // Increased from max-w-6xl for consistency
      case 'wide':
      default:
        return 'max-w-full px-4 md:px-6'; // Changed to full width with padding
    }
  };

  // Read sidebar state from localStorage on initial load
  const defaultSidebarState = () => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebar-state');
      return savedState === 'closed' ? false : true;
    }
    return true;
  };

  return (
    <SidebarProvider defaultOpen={defaultSidebarState()}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex w-full">
        <ModernSidebar />
        
        <DashboardProvider>
          <SidebarInset className="flex flex-col">
            <ModernTopBar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className={cn("mx-auto px-4", getMaxWidthClass())}>
                {children}
              </div>
            </main>
          </SidebarInset>
        </DashboardProvider>
      </div>
    </SidebarProvider>
  );
};
