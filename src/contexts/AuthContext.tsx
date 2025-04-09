import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type User = {
  email: string;
  id: string;
} | null;

type Profile = {
  username?: string;
  avatar_url?: string;
  bio?: string;
  name?: string;
  theme?: string;
  font_size?: string;
  reduced_motion?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  two_factor_enabled?: boolean;
  notification_frequency?: string;
  session_timeout?: string;
} | null;

type ProfileUpdateData = Partial<Omit<Profile, 'avatar_url'>> & {
  avatar_url?: string | null;
};

interface AuthContextType {
  user: User;
  profile: Profile;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, we would check if the user is authenticated here
    // For now, let's just simulate a loading state and then set a demo user
    const timer = setTimeout(() => {
      // For demo purposes, set a mock user
      setUser(null); // Start with no user logged in
      setProfile(null);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, we would authenticate the user here
      // For demo purposes, let's simulate a successful login
      console.log('Attempting login with:', { email, password });
      
      if (email === 'demo@example.com' && password === 'password') {
        setUser({
          email: 'demo@example.com',
          id: '123456',
        });
        setProfile({
          username: 'Demo User',
          name: 'Demo User',
          bio: 'This is a demo account',
          theme: 'system',
          font_size: 'medium',
          reduced_motion: false,
          email_notifications: true,
          push_notifications: true,
          two_factor_enabled: false,
          notification_frequency: 'daily',
          session_timeout: '30',
        });
        
        toast({
          title: "Login successful",
          description: "You've been logged in to your account.",
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "An error occurred during login.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      // In a real app, we would create a new user here
      // For demo purposes, let's simulate a successful signup
      setUser({
        email,
        id: Math.random().toString(36).substring(2, 15),
      });
      setProfile({
        username: email.split('@')[0],
        name: name || email.split('@')[0],
        theme: 'system',
        font_size: 'medium',
        reduced_motion: false,
        email_notifications: true,
        push_notifications: true,
        two_factor_enabled: false,
        notification_frequency: 'daily',
        session_timeout: '30',
      });
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "An error occurred during signup.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    // In a real app, we would sign out the user here
    setUser(null);
    setProfile(null);
    
    toast({
      title: "Signed out",
      description: "You've been signed out of your account.",
    });
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    try {
      // In a real app, we would update the user's profile in the database
      setProfile(prevProfile => {
        if (!prevProfile) return null;
        return { ...prevProfile, ...data };
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: error.message || "An error occurred while updating your profile.",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
