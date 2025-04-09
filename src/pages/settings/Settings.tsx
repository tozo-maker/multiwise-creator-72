
import React from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { motion } from 'framer-motion';
import { SettingsHeader } from './components/SettingsHeader';
import { SettingsTabs } from './components/SettingsTabs';

export const Settings = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get('tab') || 'account';

  return (
    <ModernLayout contentWidth="wide">
      <SettingsContent defaultTab={defaultTab} />
    </ModernLayout>
  );
};

const SettingsContent = ({ defaultTab = 'account' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-6">
        <SettingsHeader />
        <SettingsTabs defaultTab={defaultTab} />
      </div>
    </motion.div>
  );
};

export default Settings;
