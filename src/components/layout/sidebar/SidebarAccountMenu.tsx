
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, HelpCircle } from 'lucide-react';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { Link } from 'react-router-dom';

export const SidebarAccountMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut, user, profile } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account."
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "An error occurred while signing out."
      });
    }
  };
  
  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Profile">
          <Link to="/profile">
            <User />
            <span>Profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Settings">
          <Link to="/settings">
            <Settings />
            <span>Settings</span>
          </Link>
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
    </>
  );
};
