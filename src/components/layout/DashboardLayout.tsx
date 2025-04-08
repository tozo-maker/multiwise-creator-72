
import React, { useEffect } from 'react';
import { ModernLayout } from './ModernLayout';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  contentWidth?: 'default' | 'narrow' | 'wide';
  animate?: boolean;
  pageTitle?: string;
  pageDescription?: string;
}

export function DashboardLayout({ 
  children, 
  contentWidth = 'wide',
  animate = true,
  pageTitle,
  pageDescription
}: DashboardLayoutProps) {
  const { isDark } = useTheme();
  
  // Set page title for better accessibility
  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} | MultiGuide Dashboard`;
    } else {
      document.title = 'MultiGuide Dashboard';
    }
  }, [pageTitle]);
  
  const content = (
    <div className="space-y-8" role="region" aria-label="Dashboard Content">
      {(pageTitle || pageDescription) && (
        <div className="mb-8">
          {pageTitle && (
            <h1 className={cn(
              "text-2xl font-bold mb-1",
              isDark ? "text-white" : "text-slate-900"
            )}>
              {pageTitle}
            </h1>
          )}
          {pageDescription && (
            <p className={cn(
              "text-sm",
              isDark ? "text-slate-400" : "text-slate-600"
            )}
            aria-describedby={pageTitle ? `dashboard-title-${pageTitle.replace(/\s+/g, '-').toLowerCase()}` : undefined}>
              {pageDescription}
            </p>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
  
  return (
    <ModernLayout contentWidth={contentWidth}>
      {animate ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          aria-live="polite"
        >
          {content}
        </motion.div>
      ) : content}
    </ModernLayout>
  );
}
