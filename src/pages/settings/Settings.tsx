
import React from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { motion } from 'framer-motion';
import { SettingsTabs } from './components/SettingsTabs';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
        <ThemeCard className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">Settings</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
        </ThemeCard>
        <SettingsTabs defaultTab={defaultTab} />
      </div>
    </motion.div>
  );
};

export default Settings;
