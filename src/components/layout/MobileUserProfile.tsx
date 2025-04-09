
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export const MobileUserProfile = () => {
  let user = null;
  let profile = null;
  let signOut = async () => { console.log('Default signOut'); };
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  try {
    const auth = useAuth();
    user = auth.user;
    profile = auth.profile;
    signOut = auth.signOut;
  } catch (error) {
    console.error('Error accessing auth context:', error);
  }
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link to="/auth/login">
          <Button variant="outline" size="sm" className="h-8">
            Log in
          </Button>
        </Link>
        <Link to="/auth/register">
          <Button size="sm" className="h-8">
            Sign up
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-full h-8 w-8 p-0 overflow-hidden"
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <UserCircle className={`h-6 w-6 ${isDark ? 'text-slate-300' : 'text-slate-800'}`} />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-white'}>
        <SheetHeader>
          <SheetTitle className={isDark ? 'text-slate-100' : 'text-slate-900'}>Your Account</SheetTitle>
          <SheetDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Manage your account settings
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`h-12 w-12 rounded-full overflow-hidden flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <User className={`h-6 w-6 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              )}
            </div>
            <div>
              <h3 className="font-medium">{profile?.username || user.email}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <nav className="space-y-2">
            <Link to="/profile">
              <Button variant="ghost" className="w-full justify-start">
                <UserCircle className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:hover:bg-opacity-25"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileUserProfile;
