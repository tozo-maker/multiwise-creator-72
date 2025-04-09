
import React from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { AnalyticsMainContent } from './components/AnalyticsMainContent';

export const Analytics = () => {
  return (
    <ModernLayout contentWidth="wide">
      <DashboardProvider>
        <AnalyticsMainContent />
      </DashboardProvider>
    </ModernLayout>
  );
};

export default Analytics;
