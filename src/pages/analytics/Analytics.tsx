
import React from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { AnalyticsMainContent } from './components/AnalyticsMainContent';

export const Analytics = () => {
  return (
    <DashboardProvider>
      <ModernLayout contentWidth="wide">
        <AnalyticsMainContent />
      </ModernLayout>
    </DashboardProvider>
  );
};

export default Analytics;
