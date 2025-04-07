
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { SearchBar } from '@/components/layout/search/SearchBar';
import { NotificationPanel } from './notifications/NotificationPanel';
import { UserMenu } from './user/UserMenu';
import { ThemeToggle } from './theme/ThemeToggle';
import { NewProjectButton } from '../projects/NewProjectButton';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ModernTopBar = () => {
  const { toast } = useToast();

  return (
    <header className="h-16 border-b border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800 px-4 flex items-center sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
      </div>
      
      <div className="flex-1 pl-4 pr-4 max-w-2xl mx-auto">
        <SearchBar />
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <NewProjectButton />
        
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
