
import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export const ThemeToggle = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // In a real app, you would apply the theme change to the document
    toast({
      title: `${theme === 'light' ? 'Dark' : 'Light'} theme activated`,
      description: `App theme has been changed to ${theme === 'light' ? 'dark' : 'light'} mode.`
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="hidden sm:flex"
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
