
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const SESSION_STORAGE_KEY = 'sb-lejrjwwtovvzekqevsez-auth-token';

/**
 * Gets the current session from storage
 */
export const getStoredSession = (): Session | null => {
  try {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!storedSession) {
      return null;
    }
    
    // Attempt to parse the stored session
    const parsedSession = JSON.parse(storedSession);
    
    // Check if it has the structure of a session
    if (parsedSession && typeof parsedSession === 'object' && parsedSession.access_token && parsedSession.refresh_token) {
      return parsedSession;
    }
    
    // Not a valid session structure
    console.warn('Found stored session data but it does not appear to be a valid session');
    return null;
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
  const timeRemaining = expiresAt - Date.now();
  
  // Add debug logging for session expiration info
  console.log(`Session expires at: ${new Date(expiresAt).toISOString()}`);
  console.log(`Time remaining: ${Math.round(timeRemaining / 1000)} seconds`);
  
  return timeRemaining <= 0;
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
  try {
    // First try to get the current session directly from auth
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
    }
    
    if (sessionData?.session) {
      console.log('Valid session found from auth.getSession()');
      return sessionData.session;
    }
    
    // If no current session, check local storage
    const storedSession = getStoredSession();
    
    // If no stored session either, return null
    if (!storedSession) {
      console.log('No stored session found');
      return null;
    }
    
    // If session exists but is expired, try to refresh
    if (isSessionExpired(storedSession)) {
      console.log('Session expired, attempting to refresh');
      return await refreshSession();
    }
    
    console.log('Valid session found in storage');
    return storedSession;
  } catch (error) {
    console.error('Error getting valid session:', error);
    return null;
  }
};

/**
 * Handles session timeout and auto-refresh
 * @param onSessionTimeout Callback function to execute when session times out completely
 * @returns Cleanup function
 */
export const setupSessionRefresh = (onSessionTimeout: () => void): () => void => {
  // Check session every minute
  const intervalId = setInterval(async () => {
    try {
      const session = await getValidSession();
      if (!session) {
        console.log('No valid session found during interval check, triggering timeout callback');
        onSessionTimeout();
        clearInterval(intervalId);
      } else if (session.expires_at) {
        const expiresAt = session.expires_at * 1000;
        const timeRemaining = expiresAt - Date.now();
        
        // Log time remaining for debugging
        console.log(`Session refresh check: ${Math.round(timeRemaining / 1000)}s remaining`);
        
        // If less than 5 minutes remaining, attempt refresh
        if (timeRemaining < 300000) {
          console.log('Session expiring soon, refreshing');
          await refreshSession();
        }
      }
    } catch (error) {
      console.error('Error in session refresh interval:', error);
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

/**
 * Get public session information safe for logging
 */
export const getSessionInfo = (session: Session | null): string => {
  if (!session) return 'null';
  
  return JSON.stringify({
    user_id: session.user?.id,
    expires_at: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
    has_access_token: !!session.access_token,
    has_refresh_token: !!session.refresh_token,
  });
};
