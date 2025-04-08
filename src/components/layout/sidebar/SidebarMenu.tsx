
import React, { KeyboardEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDark } = useTheme();
  
  const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    // Navigate on Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = to;
    }
  };

  return (
    <motion.div
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={isActive}
          tooltip={tooltip || label}
          aria-current={isActive ? 'page' : undefined}
        >
          <Link 
            to={to} 
            className="transition-colors duration-200"
            onKeyDown={handleKeyDown}
            aria-label={`Navigate to ${label}`}
            role="menuitem"
            tabIndex={0}
            style={{ 
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            {icon}
            <span>{label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </motion.div>
  );
};

interface SidebarNavItemsProps {
  items: SidebarMenuItemProps[];
}

export const SidebarNavItems: React.FC<SidebarNavItemsProps> = React.memo(({ items }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') {
      return true;
    }
    
    // For other paths, check if the location starts with the path
    return location.pathname.startsWith(path);
  };

  // Container animation for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  // Child item animation
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn(isMobile ? "px-2" : "")}
      role="menu"
      aria-label="Main Navigation"
    >
      {items.map((item) => (
        <motion.div key={item.to} variants={itemVariants}>
          <SidebarMenuLink
            icon={item.icon}
            label={item.label}
            to={item.to}
            tooltip={item.tooltip}
            isActive={isActive(item.to)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
});

SidebarNavItems.displayName = 'SidebarNavItems';
