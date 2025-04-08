
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';

export const MobileThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className={`px-3 py-4 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
      <h4 className={`px-2 text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider`}>
        Theme
      </h4>
      <div className="mt-2 flex items-center justify-between px-2">
        <span className="text-sm">Dark Mode</span>
        <Switch
          checked={isDark}
          onCheckedChange={toggleTheme}
          aria-label="Toggle dark mode"
        />
      </div>
    </div>
  );
};
