
import React from 'react';
import { motion } from 'framer-motion';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const SettingsHeader = () => {
  return (
    <ThemeCard className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold">Settings</CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
    </ThemeCard>
  );
};
