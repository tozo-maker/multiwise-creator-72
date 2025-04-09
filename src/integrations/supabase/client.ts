
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://piavblsenfvaqomnbimo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYXZibHNlbmZ2YXFvbW5iaW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NjEyNTksImV4cCI6MjA1ODMzNzI1OX0.y5gKYuA4dY3fj4NlxTuTwmzlDOhjCKSNbKmVSAnd2Qk';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
