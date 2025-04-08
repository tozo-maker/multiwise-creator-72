
import React from 'react';
import { Menu, BookText } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MobileMenuItems } from '@/components/layout/mobile/MobileMenuItems';
import { MobileProjectNavigation } from '@/components/layout/mobile/MobileProjectNavigation';
import { MobileUserProfile } from '@/components/layout/mobile/MobileUserProfile';
import { MobileThemeToggle } from '@/components/layout/mobile/MobileThemeToggle';
import { MobileUserSection } from '@/components/layout/mobile/MobileUserSection';
import { useTheme } from '@/contexts/ThemeContext';

export const MobileNavigation = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

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
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="w-[280px] p-0" 
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
          
          <div className="py-2 flex-1 overflow-y-auto" role="navigation" aria-label="Mobile Navigation Menu">
            <MobileMenuItems />
            <MobileProjectNavigation />
            <MobileThemeToggle />
          </div>
          
          <MobileUserSection />
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Add missing import
import { cn } from '@/lib/utils';
