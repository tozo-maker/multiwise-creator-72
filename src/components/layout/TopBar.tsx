
import React, { useState } from 'react';
import { Bell, ChevronDown, Search, Moon, Sun, HelpCircle, LogOut, User, Settings, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileNavigation } from './MobileNavigation';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/components/ui/use-toast';
import { useDashboard } from '@/contexts/DashboardContext';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export const TopBar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { searchTerm, setSearchTerm } = useDashboard();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Content generation complete',
      description: 'Your Spanish vocabulary list has been generated.',
      time: '5 minutes ago',
      read: false
    },
    {
      id: '2',
      title: 'New feature available',
      description: 'Try our improved knowledge base organization tools.',
      time: '2 hours ago',
      read: false
    },
    {
      id: '3',
      title: 'Project shared with you',
      description: 'Maria shared "French Curriculum" with you.',
      time: '1 day ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // In a real app, you would apply the theme change to the document
    toast({
      title: `${theme === 'light' ? 'Dark' : 'Light'} theme activated`,
      description: `App theme has been changed to ${theme === 'light' ? 'dark' : 'light'} mode.`
    });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({
      title: "All notifications marked as read",
      duration: 2000,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleLogout = () => {
    // In a real app, we'd call a logout API
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/';
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <MobileNavigation />
      </div>
      
      <div className="flex-1 mx-4 max-w-3xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            type="text" 
            placeholder="Search projects, files, and more..." 
            className="pl-10 pr-10 bg-slate-50 border-slate-200 focus:bg-white w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-slate-800"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            aria-label="Toggle advanced search"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
        {showAdvancedSearch && (
          <div className="absolute z-10 mt-1 w-full max-w-3xl bg-white border border-slate-200 rounded-md shadow-lg p-4 animate-in fade-in-50 slide-in-from-top-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Filter by</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">Type: All</Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">Status: All</Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">Language: All</Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Search in</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">Projects</Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">Documents</Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">Content</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="hidden sm:flex"
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="hidden sm:flex"
          onClick={() => {
            toast({
              title: "Help panel opened",
              description: "Here you can find helpful tips and guides.",
            });
          }}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-500"></span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>
                Stay updated with project changes and announcements
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length > 0 ? (
                <>
                  <div className="flex justify-between items-center py-2 px-1">
                    <span className="text-sm font-medium text-slate-700">
                      {unreadCount} unread notification{unreadCount !== 1 && 's'}
                    </span>
                    {unreadCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2 mt-2">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-3 rounded-md transition-colors ${notification.read ? 'bg-white' : 'bg-brand-50'}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex justify-between">
                          <h4 className={`text-sm ${notification.read ? 'font-normal' : 'font-medium'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-slate-500">{notification.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          {notification.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No notifications</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-1 pr-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-brand-100 text-brand-700">JD</AvatarFallback>
              </Avatar>
              {!isMobile && (
                <>
                  <span className="text-sm font-medium hidden sm:inline">John Doe</span>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings?tab=account')}>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === 'light' ? (
                <Moon className="mr-2 h-4 w-4" />
              ) : (
                <Sun className="mr-2 h-4 w-4" />
              )}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              Help Center
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
