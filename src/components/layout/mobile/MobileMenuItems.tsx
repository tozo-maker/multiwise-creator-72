
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookText, FolderPlus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SheetClose } from '@/components/ui/sheet';

interface MobileMenuItem {
  icon: React.ReactNode;
  text: string;
  to: string;
}

export const MobileMenuItems: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  const mainNavItems: MobileMenuItem[] = [
    { icon: <Home className="h-5 w-5" />, text: "Dashboard", to: "/dashboard" },
    { icon: <BookText className="h-5 w-5" />, text: "Projects", to: "/projects" },
    { icon: <FolderPlus className="h-5 w-5" />, text: "New Project", to: "/projects/new" },
    { icon: <Settings className="h-5 w-5" />, text: "Settings", to: "/settings" },
  ];

  return (
    <nav className="space-y-1 px-2">
      {mainNavItems.map((item, i) => (
        <SheetClose asChild key={i}>
          <Link
            to={item.to}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
              isActive(item.to) 
                ? "bg-brand-50 text-brand-700 font-medium" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            <span className={cn(isActive(item.to) ? "text-brand-600" : "text-slate-500")}>
              {item.icon}
            </span>
            <span>{item.text}</span>
          </Link>
        </SheetClose>
      ))}
    </nav>
  );
};
