
import React from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { motion } from 'framer-motion';
import { SettingsTabs } from './components/SettingsTabs';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { SettingsHeader } from './components/SettingsHeader';

export const Settings = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get('tab') || 'account';
  
  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Settings' }
  ];

  return (
    <ModernLayout contentWidth="wide">
      <SettingsContent defaultTab={defaultTab} breadcrumbItems={breadcrumbItems} />
    </ModernLayout>
  );
};

const SettingsContent = ({ defaultTab = 'account', breadcrumbItems }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <PageBreadcrumbs items={breadcrumbItems} />
        <SettingsHeader />
        <SettingsTabs defaultTab={defaultTab} />
      </div>
    </motion.div>
  );
};

export default Settings;
