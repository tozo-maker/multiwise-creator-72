
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Initialize with default values
  const [theme, setThemeState] = useState<Theme>('system');
  const [initialized, setInitialized] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Use a state to track if auth context is available
  const [authContextAvailable, setAuthContextAvailable] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [updateProfileFn, setUpdateProfileFn] = useState<any>(null);

  // Try to get auth context
  useEffect(() => {
    try {
      const { profile, updateProfile } = useAuth();
      setProfileData(profile);
      setUpdateProfileFn(() => updateProfile);
      setAuthContextAvailable(true);
    } catch (error) {
      console.log('Auth context not available yet, using defaults');
      setAuthContextAvailable(false);
    }
  }, []);
  
  // Check if window exists to avoid server-side rendering issues
  const isDark = typeof window !== 'undefined' ? 
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) 
    : isDarkMode;

  // Initialize theme from profile or localStorage as fallback
  useEffect(() => {
    const loadTheme = async () => {
      let themeToUse: Theme;
      
      if (authContextAvailable && profileData?.theme) {
        // Use theme from profile if available
        themeToUse = profileData.theme as Theme;
      } else {
        // Fallback to localStorage or OS preference
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        
        if (typeof window !== 'undefined') {
          const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
          
          if (savedTheme) {
            themeToUse = savedTheme;
          } else {
            themeToUse = prefersDarkMode ? 'dark' : 'light';
          }
        } else {
          themeToUse = savedTheme || 'system';
        }
      }
      
      setThemeState(themeToUse);
      applyTheme(themeToUse);
      setInitialized(true);
    };
    
    loadTheme();
  }, [profileData, authContextAvailable]);

  // Apply theme to document and set dark mode state
  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;
    
    const isDarkTheme = newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setIsDarkMode(isDarkTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Set and save theme to both localStorage and profile
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // Save to profile in Supabase if user is authenticated
    if (authContextAvailable && profileData?.id && updateProfileFn) {
      try {
        await updateProfileFn({ theme: newTheme });
      } catch (error) {
        console.error('Error saving theme to profile:', error);
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    
    toast({
      title: `${newTheme === 'dark' ? 'Dark' : 'Light'} theme activated`,
      description: `App theme has been changed to ${newTheme} mode.`,
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
