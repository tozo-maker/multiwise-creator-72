
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  BookText,
  FolderPlus,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const MobileNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { icon: <Home className="h-5 w-5" />, text: "Dashboard", to: "/dashboard" },
    { icon: <BookText className="h-5 w-5" />, text: "Projects", to: "/projects" },
    { icon: <FolderPlus className="h-5 w-5" />, text: "New Project", to: "/projects/new" },
    { icon: <Settings className="h-5 w-5" />, text: "Settings", to: "/settings" },
  ];

  return (
    <div className="block md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-brand-500 flex items-center justify-center mr-2">
                <BookText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">MultiGuide</span>
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <nav className="space-y-1 px-3">
              {navItems.map((item, i) => (
                <SheetClose asChild key={i}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-3 rounded-md transition-colors",
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
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
