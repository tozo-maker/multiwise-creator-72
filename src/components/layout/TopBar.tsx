
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileNavigation } from './MobileNavigation';
import { useToast } from '@/components/ui/use-toast';
import { SearchBar } from './search/SearchBar';
import { NotificationPanel } from './notifications/NotificationPanel';
import { UserMenu } from './user/UserMenu';
import { ThemeToggle } from './theme/ThemeToggle';

export const TopBar = () => {
  const { toast } = useToast();

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center sticky top-0 z-10">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <MobileNavigation />
      </div>
      
      <div className="flex-1 pl-0 sm:pl-6 pr-4">
        <SearchBar />
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <ThemeToggle />
        
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

        <NotificationPanel />
        
        <UserMenu />
      </div>
    </header>
  );
};
