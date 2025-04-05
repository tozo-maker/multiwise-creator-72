
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
import { MobileMenuItems } from './mobile/MobileMenuItems';
import { MobileProjectNavigation } from './mobile/MobileProjectNavigation';
import { MobileUserProfile } from './mobile/MobileUserProfile';
import { MobileThemeToggle } from './mobile/MobileThemeToggle';
import { MobileUserSection } from './mobile/MobileUserSection';

export const MobileNavigation = () => {
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
          
          <MobileUserProfile />
          
          <div className="py-2 flex-1 overflow-y-auto">
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
