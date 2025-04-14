
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getValidSession, setupSessionRefresh, getSessionInfo } from '@/utils/sessionUtils';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/services/AuthService';
import { ProfileService } from '@/services/ProfileService';
import { Profile, AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function UnifiedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { toast } = useToast();
  
  const fetchProfileSafely = useCallback(async (userId: string): Promise<void> => {
    if (!userId) return;
    
    console.log('Safely fetching profile for user ID:', userId);
    
    try {
      const profileData = await ProfileService.fetchProfile(userId);
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
      setIsLoading(true);
      const result = await AuthService.signIn(email, password);
      
      if (!result.error) {
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
      }
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setIsLoading(true);
      const result = await AuthService.signUp(email, password, metadata);
      
      if (!result.error) {
        toast({
          title: "Account created",
          description: result.user && !session 
            ? "Please check your email for verification instructions."
            : "You are now signed in!",
        });
      }
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await AuthService.signOut();
      
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
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
      setIsLoading(true);
      const result = await AuthService.resetPassword(email);
      
      if (!result.error) {
        toast({
          title: "Password reset email sent",
          description: "Please check your email for instructions to reset your password.",
        });
      }
      
      return result;
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
      setIsLoading(true);
      await ProfileService.updateProfile(user.id, data);
      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
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
