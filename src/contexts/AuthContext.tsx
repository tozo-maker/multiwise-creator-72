
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  email: string;
  id: string;
} | null;

type Profile = {
  username?: string;
  avatar_url?: string;
} | null;

interface AuthContextType {
  user: User;
  profile: Profile;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would check if the user is authenticated here
    // For now, let's just simulate a loading state and then set a demo user
    const timer = setTimeout(() => {
      // For demo purposes, set a mock user
      setUser({
        email: 'demo@example.com',
        id: '123456',
      });
      setProfile({
        username: 'Demo User',
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const signOut = async () => {
    // In a real app, we would sign out the user here
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut }}>
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
