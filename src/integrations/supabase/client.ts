
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lejrjwwtovvzekqevsez.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlanJqd3d0b3Z2emVrcWV2c2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MDc5NDAsImV4cCI6MjA2MDA4Mzk0MH0.JeoqLMiHUy-b00kE3ZUhJbQp8YQu-cMa5Ptp1JIEKZQ';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'sb-lejrjwwtovvzekqevsez-auth-token',
    flowType: 'implicit'
  }
});

// Add a listener for auth changes to help with debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log(`Supabase auth event: ${event}`, session ? 'Session exists' : 'No session');
});

// Export a function to get current session for easy access
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (err) {
    console.error('Error getting current session:', err);
    return null;
  }
};

// Export a function to get current user for easy access
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
};
