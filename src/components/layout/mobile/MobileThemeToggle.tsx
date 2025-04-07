
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export const MobileThemeToggle: React.FC = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    }
  }, []);

  const setLightTheme = () => {
    if (theme === 'light') return;
    setTheme('light');
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
    toast({
      title: "Light theme activated",
      description: "App theme has been changed to light mode.",
    });
  };

  const setDarkTheme = () => {
    if (theme === 'dark') return;
    setTheme('dark');
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');
    toast({
      title: "Dark theme activated",
      description: "App theme has been changed to dark mode.",
    });
  };

  return (
    <div className="px-3 py-4">
      <h4 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Theme
      </h4>
      <div className="mt-2 flex items-center space-x-2">
        <Button 
          variant={theme === 'light' ? "default" : "outline"} 
          size="sm" 
          className="w-full justify-start gap-2"
          onClick={setLightTheme}
        >
          <Sun className="h-4 w-4" />
          Light
        </Button>
        <Button 
          variant={theme === 'dark' ? "default" : "outline"} 
          size="sm" 
          className="w-full justify-start gap-2"
          onClick={setDarkTheme}
        >
          <Moon className="h-4 w-4" />
          Dark
        </Button>
      </div>
    </div>
  );
};
