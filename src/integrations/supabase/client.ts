
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lejrjwwtovvzekqevsez.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlanJqd3d0b3Z2emVrcWV2c2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MDc5NDAsImV4cCI6MjA2MDA4Mzk0MH0.JeoqLMiHUy-b00kE3ZUhJbQp8YQu-cMa5Ptp1JIEKZQ';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
