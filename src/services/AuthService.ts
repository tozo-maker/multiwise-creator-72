
import { supabase } from '@/integrations/supabase/client';

export const AuthService = {
  async signIn(email: string, password: string) {
    try {
      console.log('Attempting sign-in with email:', email);
      
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
      
      return { error: null };
    } catch (error: any) {
      console.error('Exception during sign in:', error);
      return { error };
    }
  },

  async signUp(email: string, password: string, metadata?: any) {
    try {
      console.log('Attempting sign-up with email:', email);
      
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
      
      return { error: null, user: data?.user || null };
    } catch (error: any) {
      console.error('Exception during sign up:', error);
      return { error, user: null };
    }
  },

  async signOut() {
    try {
      console.log('Signing out');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Sign-out successful');
    } catch (error: any) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  async resetPassword(email: string) {
    try {
      console.log('Attempting password reset for email:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (!error) {
        console.log('Password reset email sent to:', email);
      } else {
        console.error('Password reset error:', error);
      }
      
      return { error };
    } catch (error: any) {
      console.error('Exception during password reset:', error);
      return { error };
    }
  }
};
