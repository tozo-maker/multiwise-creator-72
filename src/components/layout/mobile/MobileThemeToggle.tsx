
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export const MobileThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const setLightTheme = () => {
    if (theme === 'light') return;
    setTheme('light');
  };

  const setDarkTheme = () => {
    if (theme === 'dark') return;
    setTheme('dark');
  };

  return (
    <div className="px-3 py-4">
      <h4 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
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
