
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SheetClose, SheetFooter } from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';

export const MobileUserSection: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
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
  );
};
