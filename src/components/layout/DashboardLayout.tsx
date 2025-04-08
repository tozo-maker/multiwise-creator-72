import React, { useEffect, useRef } from 'react';
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
  mainId?: string;
}
export const DashboardLayout = React.memo(function DashboardLayout({
  children,
  contentWidth = 'wide',
  animate = true,
  pageTitle,
  pageDescription,
  mainId = 'main-content'
}: DashboardLayoutProps) {
  const {
    isDark
  } = useTheme();
  const mainRef = useRef<HTMLElement>(null);

  // Set page title for better accessibility
  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} | MultiGuide Dashboard`;
    } else {
      document.title = 'MultiGuide Dashboard';
    }

    // Focus the main content area when the page loads for accessibility
    if (mainRef.current) {
      mainRef.current.focus();
    }

    // Return a cleanup function to reset the title when unmounting
    return () => {
      document.title = 'MultiGuide Dashboard';
    };
  }, [pageTitle]);

  // Create a valid id from the title for ARIA references
  const titleId = pageTitle ? `dashboard-title-${pageTitle.replace(/\s+/g, '-').toLowerCase()}` : undefined;
  const content = <main id={mainId} ref={mainRef} className="space-y-8" role="main" aria-labelledby={titleId} tabIndex={-1} // Allow programmatic focus but not tab focus
  >
      {(pageTitle || pageDescription) && <header className="mb-8">
          {pageTitle}
          {pageDescription}
        </header>}
      
      {children}
    </main>;
  return <ModernLayout contentWidth={contentWidth}>
      {animate ? <motion.div initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3
    }} aria-live="polite">
          {content}
        </motion.div> : content}
    </ModernLayout>;
});
DashboardLayout.displayName = 'DashboardLayout';