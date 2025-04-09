
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const AnalyticsEmptyState = () => {
  const { isDark } = useTheme();
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className={`h-12 w-12 mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
      <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
        No Analytics Data Available
      </h3>
      <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Create projects and generate content to see analytics data
      </p>
    </div>
  );
};
