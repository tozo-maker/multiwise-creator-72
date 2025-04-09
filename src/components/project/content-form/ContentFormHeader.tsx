
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export interface ContentFormHeaderProps {
  title: string;
}

export const ContentFormHeader: React.FC<ContentFormHeaderProps> = ({ title }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="mb-6">
      <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        {title}
      </h1>
      <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
        Generate and edit content with AI assistance
      </p>
    </div>
  );
};

export default ContentFormHeader;
