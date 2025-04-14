
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/contexts/auth/types';

export const ProfileService = {
  async fetchProfile(userId: string): Promise<Profile | null> {
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
  },

  async updateProfile(userId: string, data: Partial<Profile>): Promise<void> {
    if (!userId) {
      throw new Error('Cannot update profile: No user ID provided');
    }
    
    try {
      console.log('Updating user profile with data:', data);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...data, updated_at: new Date().toISOString() })
        .select()
        .single();

      if (error) throw error;
      
      console.log('Profile update successful');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};
