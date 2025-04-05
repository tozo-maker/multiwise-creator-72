
import React from 'react';
import { motion } from 'framer-motion';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children,
  showBreadcrumbs = true
}) => {
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerAnimation}
      initial="hidden"
      animate="show"
    >
      {showBreadcrumbs && (
        <motion.div variants={itemAnimation}>
          <PageBreadcrumbs 
            items={[{ label: 'Dashboard', path: '/dashboard' }]} 
          />
        </motion.div>
      )}
      
      {children}
    </motion.div>
  );
};
