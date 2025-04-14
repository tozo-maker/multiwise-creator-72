
import { useCallback } from 'react';
import { ProfileService } from '@/services/ProfileService';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for profile-related functionality
 */
export const useProfileManagement = (user: User | null) => {
  const fetchProfileSafely = useCallback(async (userId: string): Promise<any> => {
    if (!userId) return null;
    
    console.log('Safely fetching profile for user ID:', userId);
    
    try {
      const profileData = await ProfileService.fetchProfile(userId);
      return profileData || null;
    } catch (err) {
      console.error('Error in fetchProfileSafely:', err);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<any> => {
    if (!user?.id) {
      console.log('Cannot refresh profile, no user ID available');
      return null;
    }
    
    console.log('Explicitly refreshing profile for user:', user.id);
    return await fetchProfileSafely(user.id);
  }, [user?.id, fetchProfileSafely]);

  return {
    fetchProfileSafely,
    refreshProfile
  };
};

/**
 * Hook for authentication error handling
 */
export const useAuthErrorHandler = () => {
  const { toast } = useToast();

  const handleAuthError = useCallback((error: any) => {
    console.error('Authentication error:', error);
    const errorMsg = error?.message || 'Unknown authentication error';
    
    if (!errorMsg.includes('expired')) {
      toast({
        title: "Authentication Error",
        description: errorMsg,
        variant: "destructive"
      });
    }
    
    return errorMsg;
  }, [toast]);

  return { handleAuthError };
};
