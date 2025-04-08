
import React, { useCallback } from 'react';
import { Menu, BookText } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MobileAccessibleNavigation } from '@/components/layout/mobile/MobileAccessibleNavigation';
import { MobileProjectNavigation } from '@/components/layout/mobile/MobileProjectNavigation';
import { MobileUserProfile } from '@/components/layout/mobile/MobileUserProfile';
import { MobileThemeToggle } from '@/components/layout/mobile/MobileThemeToggle';
import { MobileUserSection } from '@/components/layout/mobile/MobileUserSection';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export const MobileNavigation = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div className="block md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={toggleMenu}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className={cn(
            "w-[280px] p-0",
            isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"
          )}
          onKeyDown={handleKeyDown}
          aria-label="Mobile Navigation"
        >
          <SheetHeader className={cn(
            "p-4 border-b",
            isDark ? "border-slate-700" : "border-slate-200"
          )}>
            <SheetTitle className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-brand-500 flex items-center justify-center mr-2">
                <BookText className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className={cn(
                "text-xl font-bold", 
                isDark ? "text-white" : "text-slate-900"
              )}>
                MultiGuide
              </span>
            </SheetTitle>
          </SheetHeader>
          
          <MobileUserProfile />
          
          <div 
            className="py-2 flex-1 overflow-y-auto" 
            role="navigation" 
            aria-label="Mobile Navigation Menu"
          >
            <MobileAccessibleNavigation />
            <MobileProjectNavigation />
            <MobileThemeToggle />
          </div>
          
          <MobileUserSection />
        </SheetContent>
      </Sheet>
    </div>
  );
};
