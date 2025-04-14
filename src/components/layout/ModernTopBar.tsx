
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserMenu } from '@/components/layout/user/UserMenu';
import { MobileUserSection } from '@/components/layout/mobile/MobileUserSection';
import { MobileMenuItems } from '@/components/layout/mobile/MobileMenuItems';
import { MobileProjectNavigation } from '@/components/layout/mobile/MobileProjectNavigation';
import { SearchBar } from '@/components/layout/search/SearchBar';
import { ThemeToggle } from '@/components/layout/theme/ThemeToggle';
import { MobileThemeToggle } from '@/components/layout/mobile/MobileThemeToggle';
import { MobileAccessibleNavigation } from '@/components/layout/mobile/MobileAccessibleNavigation';
import { NotificationPanel } from '@/components/layout/notifications/NotificationPanel';
import { useAuth } from '@/contexts/auth';
import { AlertTriangle } from 'lucide-react';

export const ModernTopBar = ({ showProjectNav = false }) => {
  const { authError, retryAuthentication } = useAuth();
  
  const handleRetryAuth = async () => {
    if (retryAuthentication) {
      await retryAuthentication();
    }
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <MobileMenuItems />
          </nav>
          {showProjectNav && (
            <div className="mt-6 border-t pt-6">
              <MobileProjectNavigation />
            </div>
          )}
          <div className="mt-auto border-t pt-4">
            <MobileThemeToggle />
          </div>
          <div className="border-t pt-4">
            <MobileUserSection />
          </div>
          <div className="mt-2">
            <MobileAccessibleNavigation />
          </div>
        </SheetContent>
      </Sheet>
      <div className="ml-auto flex items-center gap-2">
        {authError && (
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:inline-flex items-center gap-1 border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
            onClick={handleRetryAuth}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Retry Auth</span>
          </Button>
        )}
        <SearchBar />
        <ThemeToggle />
        <NotificationPanel />
        <UserMenu />
      </div>
    </header>
  );
};

export default ModernTopBar;
