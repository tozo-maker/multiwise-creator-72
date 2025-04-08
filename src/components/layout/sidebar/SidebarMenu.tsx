
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

interface SidebarMenuItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  tooltip?: string;
  isActive?: boolean;
}

export const SidebarMenuLink: React.FC<SidebarMenuItemProps> = ({
  icon,
  label,
  to,
  tooltip,
  isActive,
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        tooltip={tooltip || label}
      >
        <Link to={to}>
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

interface SidebarNavItemProps {
  items: SidebarMenuItemProps[];
}

export const SidebarNavItems: React.FC<SidebarNavItemProps> = ({ items }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') {
      return true;
    }
    
    // For other paths, check if the location starts with the path
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {items.map((item) => (
        <SidebarMenuLink
          key={item.to}
          icon={item.icon}
          label={item.label}
          to={item.to}
          tooltip={item.tooltip}
          isActive={isActive(item.to)}
        />
      ))}
    </>
  );
};
