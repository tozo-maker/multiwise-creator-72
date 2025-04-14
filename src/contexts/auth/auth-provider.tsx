import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { 
  getValidSession, 
  setupSessionRefresh, 
  getSessionInfo, 
  clearSessionStorage 
} from '@/utils/sessionUtils';
import { useToast } from '@/hooks/use-toast';
import { Profile, AuthContextType, AuthChangeEvent } from './types';
import { useProfileManagement, useAuthErrorHandler } from './hooks';
import { createAuthActions } from './auth-actions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [lastRefreshAttempt, setLastRefreshAttempt] = useState<number>(0);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { fetchProfileSafely, refreshProfile: refreshProfileHook } = useProfileManagement(user);
  const { handleAuthError } = useAuthErrorHandler();
  
  const { 
    signIn, 
    signUp, 
    signOut, 
    resetPassword, 
    updateProfile,
    retryAuthentication: retryAuth
  } = createAuthActions(
    setIsLoading,
    setAuthError,
    handleAuthError,
    toast,
    fetchProfileSafely,
    setUser,
    setSession,
    setProfile,
    user
  );
  
  const retryAuthentication = useCallback(async () => {
    return await retryAuth(lastRefreshAttempt, setLastRefreshAttempt);
  }, [retryAuth, lastRefreshAttempt]);
  
  const refreshProfile = useCallback(async () => {
    const updatedProfile = await refreshProfileHook();
    if (updatedProfile) {
      setProfile(updatedProfile);
    }
  }, [refreshProfileHook]);

  useEffect(() => {
    let mounted = true;
    console.log('Auth context initializing');

    const initAuth = async () => {
      try {
        console.log('Setting up auth state listener');
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event: AuthChangeEvent, newSession) => {
            if (!mounted) return;
            console.log(`Auth state changed: ${event}`, newSession ? 'Session exists' : 'No session');

            if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
              console.log('User signed out or deleted, clearing auth state');
              setUser(null);
              setSession(null);
              setProfile(null);
              clearSessionStorage();
            } else if (newSession) {
              console.log(`New session established for user: ${newSession.user.id}`);
              console.log(`Session info: ${getSessionInfo(newSession)}`);
              
              setUser(newSession.user);
              setSession(newSession);
              setAuthError(null);
              
              if (newSession.user) {
                setTimeout(() => {
                  if (mounted) {
                    fetchProfileSafely(newSession.user.id).then(profileData => {
                      if (mounted && profileData) {
                        setProfile(profileData);
                      }
                    });
                  }
                }, 0);
              }
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
          setAuthError(null);
          
          const profileData = await fetchProfileSafely(currentSession.user.id);
          if (mounted && profileData) {
            setProfile(profileData);
          }
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
          setAuthError(handleAuthError(error));
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
        console.log('Session expired completely, notifying user');
        setAuthError('Your session has expired. Please sign in again.');
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
  }, [fetchProfileSafely, handleAuthError, toast]);

  const value = {
    session,
    user,
    profile,
    isLoading: isLoading || !isInitialized,
    isAuthenticated: !!user,
    authError,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
    retryAuthentication,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const UnifiedAuthProvider = AuthProvider;

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
