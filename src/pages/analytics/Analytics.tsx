
import React from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { AnalyticsMainContent } from './components/AnalyticsMainContent';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const Analytics = () => {
  return (
    <ModernLayout contentWidth="wide">
      <DashboardProvider>
        <ThemeCard className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">Analytics</CardTitle>
            <CardDescription>
              Track and analyze your project metrics and performance
            </CardDescription>
          </CardHeader>
        </ThemeCard>
        <AnalyticsMainContent />
      </DashboardProvider>
    </ModernLayout>
  );
};

export default Analytics;
