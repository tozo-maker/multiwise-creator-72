
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export const MobileThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const setLightTheme = () => {
    if (theme === 'light') return;
    setTheme('light');
  };

  const setDarkTheme = () => {
    if (theme === 'dark') return;
    setTheme('dark');
  };

  return (
    <div className={`px-3 py-4 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
      <h4 className={`px-2 text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider`}>
        Theme
      </h4>
      <div className="mt-2 flex items-center space-x-2">
        <Button 
          variant={theme === 'light' ? "default" : "outline"} 
          size="sm" 
          className={`w-full justify-start gap-2 ${
            theme === 'light' 
              ? 'bg-brand-600 hover:bg-brand-700 text-white' 
              : isDark 
                ? 'border-slate-700 text-slate-200 hover:bg-slate-800' 
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
          onClick={setLightTheme}
        >
          <Sun className="h-4 w-4" />
          Light
        </Button>
        <Button 
          variant={theme === 'dark' ? "default" : "outline"} 
          size="sm" 
          className={`w-full justify-start gap-2 ${
            theme === 'dark' 
              ? 'bg-brand-600 hover:bg-brand-700 text-white' 
              : isDark 
                ? 'border-slate-700 text-slate-200 hover:bg-slate-800' 
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
          onClick={setDarkTheme}
        >
          <Moon className="h-4 w-4" />
          Dark
        </Button>
      </div>
    </div>
  );
};
