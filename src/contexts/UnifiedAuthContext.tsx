
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getValidSession, setupSessionRefresh } from '@/utils/sessionUtils';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  username?: string;
  avatar_url?: string;
  name?: string;
  theme?: string;
  bio?: string;
  email_notifications?: boolean;
  font_size?: string;
  reduced_motion?: boolean;
  push_notifications?: boolean;
  notification_frequency?: string;
  two_factor_enabled?: boolean;
  session_timeout?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any, user: User | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function UnifiedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is not found error
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      console.log('Profile data fetched:', data);
      return data;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  };
  
  // Function to handle profile fetching with timeouts to avoid deadlocks
  const fetchProfileSafely = useCallback(async (userId: string) => {
    if (!userId) return;
    console.log('Safely fetching profile for user ID:', userId);
    const profileData = await fetchProfile(userId);
    setProfile(profileData);
  }, []);

  useEffect(() => {
    // Flag to prevent state updates after component unmount
    let mounted = true;
    console.log('Auth context initializing');

    // First set up the auth state listener for session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event);
        if (!mounted) return;

        if (newSession) {
          console.log('New session established');
          setSession(newSession);
          setUser(newSession.user);
          
          // Use setTimeout to avoid potential deadlock with the onAuthStateChange callback
          if (newSession.user) {
            setTimeout(() => {
              if (mounted) {
                fetchProfileSafely(newSession.user.id);
              }
            }, 0);
          }
        } else {
          console.log('Session ended');
          setUser(null);
          setSession(null);
          setProfile(null);
        }
      }
    );

    // Then check for existing session
    const initAuth = async () => {
      try {
        console.log('Checking for existing valid session');
        const currentSession = await getValidSession();
        
        if (!mounted) return;
        
        console.log('Initial session check result:', currentSession ? 'Session found' : 'No session');
        
        if (currentSession?.user) {
          console.log('Valid session user found:', currentSession.user.email);
          setSession(currentSession);
          setUser(currentSession.user);
          fetchProfileSafely(currentSession.user.id);
        } else {
          console.log('No valid session found');
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Initialize auth
    initAuth();

    // Set up session refresh
    const cleanupRefresh = setupSessionRefresh(() => {
      if (mounted) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive"
        });
        setUser(null);
        setSession(null);
        setProfile(null);
      }
    });

    // Clean up the subscription and interval
    return () => {
      mounted = false;
      subscription.unsubscribe();
      cleanupRefresh();
      console.log('Auth context cleanup completed');
    };
  }, [fetchProfileSafely, toast]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign-in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        console.log('Sign-in successful for:', email);
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
      } else {
        console.error('Sign-in error:', error);
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      console.log('Attempting sign-up with email:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {},
        },
      });
      
      if (!error) {
        console.log('Sign-up successful for:', email);
        toast({
          title: "Account created",
          description: "Please check your email for verification instructions.",
        });
      } else {
        console.error('Sign-up error:', error);
      }
      
      return { error, user: data?.user || null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error, user: null };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      console.log('Sign-out successful');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "An error occurred while signing out.",
        variant: "destructive"
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Attempting password reset for email:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (!error) {
        console.log('Password reset email sent to:', email);
        toast({
          title: "Password reset email sent",
          description: "Please check your email for instructions to reset your password.",
        });
      } else {
        console.error('Password reset error:', error);
      }
      
      return { error };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error };
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;
    
    try {
      console.log('Updating user profile with data:', data);
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...data })
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setProfile(prev => prev ? { ...prev, ...data } : data);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      console.log('Profile update successful');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: error.message || "An error occurred while updating your profile.",
      });
      throw error;
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an UnifiedAuthProvider');
  }
  return context;
};
