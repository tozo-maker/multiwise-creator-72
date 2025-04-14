
import { Session, User } from '@supabase/supabase-js';

export type AuthChangeEvent = 'INITIAL_SESSION' | 'PASSWORD_RECOVERY' | 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'USER_DELETED' | 'MFA_CHALLENGE_VERIFIED';

export interface Profile {
  id?: string;
  username?: string;
  avatar_url?: string;
  name?: string;
  theme?: string;
  bio?: string;
  email_notifications?: boolean;
  font_size?: string;
  reduced_motion?: boolean;
  push_notifications?: boolean;
  notification_frequency?: string;
  two_factor_enabled?: boolean;
  session_timeout?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError?: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any, user: User | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  retryAuthentication?: () => Promise<boolean>;
}
