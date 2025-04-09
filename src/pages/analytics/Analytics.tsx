
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { AnalyticsMainContent } from './components/AnalyticsMainContent';

export const Analytics = () => {
  return (
    <DashboardLayout 
      contentWidth="wide" 
      pageTitle="Analytics" 
      pageDescription="Your project stats and performance metrics."
    >
      <DashboardProvider>
        <AnalyticsMainContent />
      </DashboardProvider>
    </DashboardLayout>
  );
};

export default Analytics;
