
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  useSidebar
} from '@/components/ui/sidebar';
import { SidebarNavItems } from './sidebar/SidebarMenu';
import { SidebarAccountMenu } from './sidebar/SidebarAccountMenu';
import { useTheme } from '@/contexts/ThemeContext';

export const ModernSidebar = () => {
  const { state, setOpen } = useSidebar();
  const { theme } = useTheme();
  
  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-state', state === 'expanded' ? 'open' : 'closed');
    }
  }, [state]);
  
  const mainNavItems = [
    {
      icon: <LayoutDashboard />,
      label: 'Dashboard',
      to: '/dashboard',
      tooltip: 'Dashboard'
    },
    {
      icon: <BookText />,
      label: 'Projects',
      to: '/projects',
      tooltip: 'Projects'
    },
    {
      icon: <LineChart />,
      label: 'Analytics',
      to: '/analytics',
      tooltip: 'Analytics'
    },
    {
      icon: <Database />,
      label: 'Knowledge Base',
      to: '/knowledge-base',
      tooltip: 'Knowledge Base'
    }
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon" style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}>
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          {state === "expanded" ? (
            <>
              <div className="h-8 w-8 rounded-md bg-brand-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">MultiGuide</span>
            </>
          ) : (
            <div className="h-8 w-8 mx-auto rounded-md bg-brand-500 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
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
        {state === "expanded" && (
          <div className="mb-4 px-3 py-2">
            <div className="text-sm font-medium text-slate-900 dark:text-white">John Doe</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">john.doe@example.com</div>
          </div>
        )}
        
        <SidebarMenu>
          <SidebarAccountMenu />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

// Add missing import
import { Link } from 'react-router-dom';
