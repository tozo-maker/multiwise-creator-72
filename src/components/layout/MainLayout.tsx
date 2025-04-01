
import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  contentWidth?: 'default' | 'narrow' | 'wide';
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  contentWidth = 'default' 
}) => {
  // Map contentWidth to appropriate max-width classes
  const getMaxWidthClass = () => {
    switch (contentWidth) {
      case 'narrow':
        return 'max-w-4xl';
      case 'wide':
        return 'max-w-full';
      case 'default':
      default:
        return 'max-w-6xl';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-full">
          <div className={cn("mx-auto", getMaxWidthClass())}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
