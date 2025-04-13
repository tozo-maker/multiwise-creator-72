
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const SESSION_STORAGE_KEY = 'supabase.auth.session';

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
  return Date.now() > expiresAt;
};

/**
 * Attempts to refresh the current session
 */
export const refreshSession = async (): Promise<Session | null> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
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
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
  
  // If session exists but is expired, try to refresh
  if (isSessionExpired(storedSession)) {
    return await refreshSession();
  }
  
  return storedSession;
};
