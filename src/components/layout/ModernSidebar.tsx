
import React, { useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  BookText,
  LineChart,
  Database,
  Settings,
  HelpCircle,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import { SidebarNavItems } from '@/components/layout/sidebar/SidebarMenu';
import { SidebarAccountMenu } from '@/components/layout/sidebar/SidebarAccountMenu';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/auth';

export const ModernSidebar = () => {
  const { state, setOpen } = useSidebar();
  const { theme } = useTheme();
  const location = useLocation();
  const { user, profile } = useAuth();
  
  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-state', state === 'expanded' ? 'open' : 'closed');
    }
  }, [state]);
  
  // Add keyboard shortcut to toggle sidebar
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'm' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setOpen(state !== 'expanded');
    }
  }, [state, setOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  const mainNavItems = [
    {
      icon: <LayoutDashboard aria-hidden="true" />,
      label: 'Dashboard',
      to: '/dashboard',
      tooltip: 'Dashboard'
    },
    {
      icon: <BookText aria-hidden="true" />,
      label: 'Projects',
      to: '/projects',
      tooltip: 'Projects'
    },
    {
      icon: <LineChart aria-hidden="true" />,
      label: 'Analytics',
      to: '/analytics',
      tooltip: 'Analytics'
    },
    {
      icon: <Database aria-hidden="true" />,
      label: 'Knowledge Base',
      to: '/knowledge-base',
      tooltip: 'Knowledge Base'
    }
  ];

  // Get display name from profile
  const displayName = profile?.name || profile?.username || user?.email?.split('@')[0] || 'User';
  
  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}
      aria-label="Main Sidebar"
      aria-expanded={state === "expanded"}
    >
      <SidebarRail /> {/* Add this to make sidebar collapsible via rail */}
      <SidebarHeader>
        <Link 
          to="/" 
          className="flex items-center gap-2 px-2 py-3"
          aria-label="Home"
        >
          {state === "expanded" ? (
            <>
              <div className="h-8 w-8 rounded-md bg-brand-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">MultiGuide</span>
            </>
          ) : (
            <div className="h-8 w-8 mx-auto rounded-md bg-brand-500 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
          )}
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItems items={mainNavItems} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="flex flex-col space-y-2">
        {state === "expanded" && profile && (
          <div className="mb-4 px-3 py-2">
            <div className="text-sm font-medium text-slate-900 dark:text-white">
              {displayName}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {user?.email}
            </div>
          </div>
        )}
        
        <SidebarMenu>
          <SidebarAccountMenu />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
