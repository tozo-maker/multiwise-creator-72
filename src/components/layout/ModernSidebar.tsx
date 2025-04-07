
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import { useTheme } from '@/contexts/ThemeContext';

export const ModernSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, setOpen } = useSidebar();
  const { theme } = useTheme();
  
  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-state', state === 'expanded' ? 'open' : 'closed');
    }
  }, [state]);
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') {
      return true;
    }
    
    // For other paths, check if the location starts with the path
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    // In a real app, this would call an API to logout
    localStorage.setItem('isAuthenticated', 'false');
    
    // Use the window.handleLogout if it exists (from App.tsx)
    if (typeof window !== 'undefined' && window.handleLogout) {
      window.handleLogout();
    }
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    navigate('/');
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}>
      <SidebarRail />
      
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
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive('/dashboard')}
                  tooltip="Dashboard"
                >
                  <Link to="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive('/projects')}
                  tooltip="Projects"
                >
                  <Link to="/projects">
                    <BookText />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive('/analytics')}
                  tooltip="Analytics"
                >
                  <Link to="/analytics">
                    <LineChart />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive('/knowledge-base')}
                  tooltip="Knowledge Base"
                >
                  <Link to="/knowledge-base">
                    <Database />
                    <span>Knowledge Base</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={isActive('/settings/profile')}
              tooltip="Profile Settings"
            >
              <Link to="/settings?tab=profile">
                <User />
                <span>Profile Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={isActive('/settings')}
              tooltip="Settings"
            >
              <Link to="/settings">
                <Settings />
                <span>Account Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={isActive('/help')}
              tooltip="Help"
            >
              <Link to="/help">
                <HelpCircle />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarMenuButton 
          onClick={handleLogout}
          className="w-full justify-start text-red-600 dark:text-red-400 mt-2"
          tooltip="Logout"
        >
          <LogOut />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};
