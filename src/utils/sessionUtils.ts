
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const SESSION_STORAGE_KEY = 'sb-lejrjwwtovvzekqevsez-auth-token';

/**
 * Gets the current session from storage
 */
export const getStoredSession = (): Session | null => {
  try {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    return storedSession ? JSON.parse(storedSession) : null;
  } catch (err) {
    console.error('Error parsing stored session:', err);
    return null;
  }
};

/**
 * Checks if the current session is expired
 */
export const isSessionExpired = (session: Session): boolean => {
  if (!session || !session.expires_at) return true;
  const expiresAt = session.expires_at * 1000; // convert to ms
  return Date.now() >= expiresAt; // Changed > to >= for more precision
};

/**
 * Attempts to refresh the current session
 */
export const refreshSession = async (): Promise<Session | null> => {
  try {
    console.log('Attempting to refresh session...');
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
    console.log('Session refreshed successfully');
    return data.session;
  } catch (err) {
    console.error('Error in refreshSession:', err);
    return null;
  }
};

/**
 * Main function to get a valid session (refreshes if needed)
 */
export const getValidSession = async (): Promise<Session | null> => {
  const storedSession = getStoredSession();
  
  // If no stored session, get current session from auth
  if (!storedSession) {
    console.log('No stored session found, getting current session');
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
  
  // If session exists but is expired, try to refresh
  if (isSessionExpired(storedSession)) {
    console.log('Session expired, attempting to refresh');
    return await refreshSession();
  }
  
  console.log('Valid session found');
  return storedSession;
};

/**
 * Handles session timeout and auto-refresh
 * @param onSessionTimeout Callback function to execute when session times out completely
 * @returns Cleanup function
 */
export const setupSessionRefresh = (onSessionTimeout: () => void): () => void => {
  // Check session every minute
  const intervalId = setInterval(async () => {
    const session = await getValidSession();
    if (!session) {
      onSessionTimeout();
      clearInterval(intervalId);
    }
  }, 60000);
  
  return () => clearInterval(intervalId);
};

/**
 * Clears the stored session data
 */
export const clearSessionStorage = (): void => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    console.log('Session storage cleared');
  } catch (err) {
    console.error('Error clearing session storage:', err);
  }
};
