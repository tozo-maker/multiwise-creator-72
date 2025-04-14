import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getValidSession, setupSessionRefresh, getSessionInfo } from '@/utils/sessionUtils';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id?: string;
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
  updated_at?: string;
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
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function UnifiedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    if (!userId) {
      console.log('No user ID provided to fetchProfile');
      return null;
    }
    
    try {
      console.log(`Fetching profile for user: ${userId}`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
          return null;
        }
        
        console.log('No profile found for user', userId);
        return null;
      }
      
      console.log('Profile data fetched:', data);
      return data;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  };
  
  const fetchProfileSafely = useCallback(async (userId: string): Promise<void> => {
    if (!userId) return;
    
    console.log('Safely fetching profile for user ID:', userId);
    
    try {
      const profileData = await fetchProfile(userId);
      if (profileData) {
        setProfile(profileData);
      } else {
        console.log('No profile data returned, setting profile to null');
        setProfile(null);
      }
    } catch (err) {
      console.error('Error in fetchProfileSafely:', err);
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      console.log('Cannot refresh profile, no user ID available');
      return;
    }
    
    console.log('Explicitly refreshing profile for user:', user.id);
    await fetchProfileSafely(user.id);
  }, [user?.id, fetchProfileSafely]);

  useEffect(() => {
    let mounted = true;
    console.log('Auth context initializing');

    const initAuth = async () => {
      try {
        console.log('Setting up auth state listener');
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            if (!mounted) return;
            console.log(`Auth state changed: ${event}`, newSession ? 'Session exists' : 'No session');

            if (newSession) {
              console.log(`New session established for user: ${newSession.user.id}`);
              console.log(`Session info: ${getSessionInfo(newSession)}`);
              
              setUser(newSession.user);
              setSession(newSession);
              
              if (newSession.user) {
                setTimeout(() => {
                  if (mounted) {
                    fetchProfileSafely(newSession.user.id);
                  }
                }, 0);
              }
            } else if (event === 'SIGNED_OUT') {
              console.log('User signed out, clearing auth state');
              setUser(null);
              setSession(null);
              setProfile(null);
            }
          }
        );

        console.log('Checking for existing valid session');
        const currentSession = await getValidSession();
        
        if (!mounted) return;
        
        if (currentSession?.user) {
          console.log(`Valid session found for user: ${currentSession.user.id}`);
          console.log(`Session info: ${getSessionInfo(currentSession)}`);
          
          setSession(currentSession);
          setUser(currentSession.user);
          
          await fetchProfileSafely(currentSession.user.id);
        } else {
          console.log('No valid session found during initialization');
          setSession(null);
          setUser(null);
          setProfile(null);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error during auth initialization:', error);
        
        if (mounted) {
          setUser(null);
          setSession(null);
          setProfile(null);
        }
        
        return () => {};
      } finally {
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    const cleanup = initAuth();

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

    return () => {
      mounted = false;
      cleanupRefresh();
      
      cleanup.then(cleanupFn => {
        if (cleanupFn) cleanupFn();
      });
      
      console.log('Auth context cleanup completed');
    };
  }, [fetchProfileSafely, toast]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign-in with email:', email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign-in error:', error);
        return { error };
      }
      
      console.log('Sign-in successful for:', email);
      console.log('Session established:', data.session ? 'Yes' : 'No');
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Exception during sign in:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      console.log('Attempting sign-up with email:', email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {},
        },
      });
      
      if (error) {
        console.error('Sign-up error:', error);
        return { error, user: null };
      }
      
      console.log('Sign-up successful for:', email, 'Email confirmation required:', !data.session);
      
      toast({
        title: "Account created",
        description: data.session 
          ? "You are now signed in!"
          : "Please check your email for verification instructions.",
      });
      
      return { error: null, user: data?.user || null };
    } catch (error: any) {
      console.error('Exception during sign up:', error);
      return { error, user: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
      setIsLoading(true);
      
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
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "An error occurred while signing out.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Attempting password reset for email:', email);
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
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
    } catch (error: any) {
      console.error('Exception during password reset:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) {
      console.error('Cannot update profile: No user logged in');
      throw new Error('You must be logged in to update your profile');
    }
    
    try {
      console.log('Updating user profile with data:', data);
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...data, updated_at: new Date().toISOString() })
        .select()
        .single();

      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      console.log('Profile update successful');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: error.message || "An error occurred while updating your profile.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading: isLoading || !isInitialized,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
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
