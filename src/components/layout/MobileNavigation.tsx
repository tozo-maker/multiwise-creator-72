import React from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { 
  Home,
  BookText,
  FolderPlus,
  Settings,
  Menu,
  X,
  ChevronRight,
  LogOut,
  User,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from '@/components/ui/use-toast';

export const MobileNavigation = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const projectId = params.projectId;
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') {
      return true;
    }
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

  const mainNavItems = [
    { icon: <Home className="h-5 w-5" />, text: "Dashboard", to: "/dashboard" },
    { icon: <BookText className="h-5 w-5" />, text: "Projects", to: "/projects" },
    { icon: <FolderPlus className="h-5 w-5" />, text: "New Project", to: "/projects/new" },
    { icon: <Settings className="h-5 w-5" />, text: "Settings", to: "/settings" },
  ];
  
  const projectNavItems = projectId ? [
    { text: "Overview", to: `/projects/${projectId}` },
    { text: "Knowledge Base", to: `/projects/${projectId}/knowledge-base` },
    { text: "Content", to: `/projects/${projectId}/content` },
    { text: "Analysis", to: `/projects/${projectId}/analysis` },
    { text: "Enhancements", to: `/projects/${projectId}/enhancements` },
    { text: "Configuration", to: `/projects/${projectId}/configuration` },
    { text: "Snapshots", to: `/projects/${projectId}/snapshots` },
  ] : [];

  return (
    <div className="block md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-brand-500 flex items-center justify-center mr-2">
                <BookText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">MultiGuide</span>
            </SheetTitle>
          </SheetHeader>
          
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-brand-100 text-brand-700">JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">John Doe</p>
                <p className="text-xs text-slate-500">john.doe@example.com</p>
              </div>
            </div>
          </div>
          
          <div className="py-2 flex-1 overflow-y-auto">
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
            
            {projectId && (
              <Accordion type="single" collapsible className="px-2 mt-4">
                <AccordionItem value="project-navigation" className="border-b-0">
                  <AccordionTrigger className="py-2 px-3 hover:no-underline">
                    <span className="text-sm font-medium">Current Project</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <nav className="space-y-1 mt-1">
                      {projectNavItems.map((item, i) => (
                        <SheetClose asChild key={i}>
                          <Link
                            to={item.to}
                            className={cn(
                              "flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors",
                              location.pathname === item.to
                                ? "bg-brand-50 text-brand-700 font-medium" 
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            )}
                          >
                            <span>{item.text}</span>
                            {location.pathname === item.to && (
                              <ChevronRight className="h-4 w-4 ml-auto text-brand-600" />
                            )}
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            
            <div className="px-3 py-4">
              <h4 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Theme
              </h4>
              <div className="mt-2 flex items-center space-x-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
              </div>
            </div>
          </div>
          
          <SheetFooter className="px-4 py-4 border-t flex flex-col gap-2">
            <SheetClose asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                asChild
              >
                <Link to="/settings">
                  <User className="h-4 w-4" />
                  Account Settings
                </Link>
              </Button>
            </SheetClose>
            
            <SheetClose asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                Help & Resources
              </Button>
            </SheetClose>
            
            <SheetClose asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
