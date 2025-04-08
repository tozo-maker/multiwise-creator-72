
import React from 'react';
import { BarChart2, FileText, Activity, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface EmptyStateProps {
  type: 'stats' | 'activity' | 'content' | 'general';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionLabel,
  onAction
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const icons = {
    stats: <BarChart2 className="w-10 h-10 text-brand-300 dark:text-brand-400" />,
    activity: <Activity className="w-10 h-10 text-brand-300 dark:text-brand-400" />,
    content: <FileText className="w-10 h-10 text-brand-300 dark:text-brand-400" />,
    general: <Users className="w-10 h-10 text-brand-300 dark:text-brand-400" />
  };

  return (
    <motion.div 
      className={`flex flex-col items-center justify-center text-center p-8 ${
        isDark 
          ? 'bg-slate-800/50 border-slate-700' 
          : 'bg-slate-50 border-slate-300'
      } rounded-lg border border-dashed h-full min-h-[200px]`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${
        isDark ? 'bg-slate-700' : 'bg-white'
      } p-4 rounded-full mb-4 shadow-sm`}>
        {icons[type]}
      </div>
      <h3 className={`text-lg font-medium ${
        isDark ? 'text-slate-200' : 'text-slate-800'
      } mb-2`}>{title}</h3>
      <p className={`${
        isDark ? 'text-slate-400' : 'text-slate-500'
      } mb-4 max-w-md`}>{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-2">{actionLabel}</Button>
      )}
    </motion.div>
  );
};
