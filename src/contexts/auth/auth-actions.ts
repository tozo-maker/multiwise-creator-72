
import { AuthService } from '@/services/AuthService';
import { ProfileService } from '@/services/ProfileService';
import { forceSessionRefresh } from '@/utils/sessionUtils';
import { User } from '@supabase/supabase-js';
import { Profile } from './types';

/**
 * Authentication actions factory
 */
export const createAuthActions = (
  setIsLoading: (loading: boolean) => void,
  setAuthError: (error: string | null) => void,
  handleAuthError: (error: any) => string,
  showToast: (props: { title: string, description: string, variant?: "default" | "destructive" }) => void,
  fetchProfileSafely: (userId: string) => Promise<any>,
  setUser: (user: User | null) => void,
  setSession: (session: any) => void,
  setProfile: (profile: Profile | null) => void,
  user: User | null
) => {
  
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      const result = await AuthService.signIn(email, password);
      
      if (!result.error) {
        showToast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
      } else {
        handleAuthError(result.error);
      }
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      const result = await AuthService.signUp(email, password, metadata);
      
      if (!result.error) {
        showToast({
          title: "Account created",
          description: "Please check your email for verification instructions.",
        });
      } else {
        handleAuthError(result.error);
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
      setAuthError(null);
      
      showToast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      handleAuthError(error);
      showToast({
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
      setAuthError(null);
      const result = await AuthService.resetPassword(email);
      
      if (!result.error) {
        showToast({
          title: "Password reset email sent",
          description: "Please check your email for instructions to reset your password.",
        });
      } else {
        handleAuthError(result.error);
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
      const updatedProfile = await fetchProfileSafely(user.id);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
      
      showToast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      handleAuthError(error);
      showToast({
        variant: "destructive",
        title: "Profile update failed",
        description: error.message || "An error occurred while updating your profile.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const retryAuthentication = async (lastRefreshAttempt: number, setLastRefreshAttempt: (time: number) => void) => {
    const now = Date.now();
    
    if (now - lastRefreshAttempt < 5000) {
      console.log('Throttling refresh attempt, too soon since last attempt');
      return false;
    }
    
    setLastRefreshAttempt(now);
    setAuthError(null);
    
    try {
      console.log('Manually retrying authentication...');
      const refreshedSession = await forceSessionRefresh();
      
      if (refreshedSession) {
        console.log('Manual authentication retry successful');
        setSession(refreshedSession);
        setUser(refreshedSession.user);
        
        if (refreshedSession.user) {
          const profile = await fetchProfileSafely(refreshedSession.user.id);
          if (profile) {
            setProfile(profile);
          }
        }
        
        showToast({
          title: "Authentication Restored",
          description: "Your session has been successfully refreshed.",
        });
        
        return true;
      } else {
        console.log('Manual authentication retry failed - no session returned');
        setAuthError('Unable to restore authentication. Please sign in again.');
        return false;
      }
    } catch (error) {
      console.error('Error during manual authentication retry:', error);
      handleAuthError(error);
      return false;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    retryAuthentication
  };
};
