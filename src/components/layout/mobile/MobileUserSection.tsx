
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SheetClose, SheetFooter } from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const MobileUserSection: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
      });
    }
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
          asChild
        >
          <Link to="/help">
            <HelpCircle className="h-4 w-4" />
            Help & Resources
          </Link>
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
