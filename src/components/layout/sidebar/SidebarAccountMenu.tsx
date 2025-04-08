import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, HelpCircle } from 'lucide-react';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
export const SidebarAccountMenu = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleLogout = () => {
    // In a real app, this would call an API to logout
    localStorage.setItem('isAuthenticated', 'false');

    // Use the window.handleLogout if it exists (from App.tsx)
    if (typeof window !== 'undefined' && window.handleLogout) {
      window.handleLogout();
    }
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    });
    navigate('/');
  };
  return <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Profile Settings">
          <Link to="/settings?tab=profile">
            <User />
            <span>Profile Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Account Settings">
          
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Help">
          <Link to="/help">
            <HelpCircle />
            <span>Help</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton onClick={handleLogout} className="w-full justify-start text-red-600 dark:text-red-400" tooltip="Logout">
          <LogOut />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>;
};

// Add missing import
import { Link } from 'react-router-dom';