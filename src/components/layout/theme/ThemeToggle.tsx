
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeTooltip } from '@/components/shared/ThemeTooltip';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const isDark = theme === 'dark';

  const handleToggle = () => {
    toggleTheme();
    toast({
      title: `${isDark ? 'Light' : 'Dark'} theme activated`,
      description: `The application theme has been switched to ${isDark ? 'light' : 'dark'} mode.`,
    });
  };

  return (
    <ThemeTooltip content={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <Button 
        variant="ghost" 
        size="icon" 
        className={`hidden sm:flex ${
          isDark 
            ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        onClick={handleToggle}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: theme === 'dark' ? 360 : 0 }}
          transition={{ duration: 0.5 }}
          aria-hidden="true"
        >
          {isDark ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </motion.div>
      </Button>
    </ThemeTooltip>
  );
};
