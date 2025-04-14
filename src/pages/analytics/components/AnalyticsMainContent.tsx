
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsOverview } from './AnalyticsOverview';
import { AnalyticsDetailedView } from './AnalyticsDetailedView';
import { ContentEffectivenessView } from './ContentEffectivenessView';
import { CustomReportBuilder } from '@/components/analytics/CustomReportBuilder';
import { useDashboard } from '@/contexts/DashboardContext';
import { useTheme } from '@/contexts/ThemeContext';

export const AnalyticsMainContent = () => {
  const { isDark } = useTheme();
  const { projects } = useDashboard();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Ensure components render only after we have projects data
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (projects && projects.length > 0) {
      setIsReady(true);
    }
  }, [projects]);
  
  return (
    <div className="space-y-6">
      <PageHeader 
        heading="Analytics & Reporting" 
        subheading="Track and analyze your educational content performance"
        className="pb-4 border-b border-border"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="effectiveness">Content Effectiveness</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
        </TabsList>
        
        {isReady ? (
          <>
            <TabsContent value="overview">
              <AnalyticsOverview />
            </TabsContent>
            
            <TabsContent value="detailed">
              <AnalyticsDetailedView />
            </TabsContent>
            
            <TabsContent value="effectiveness">
              <ContentEffectivenessView />
            </TabsContent>
            
            <TabsContent value="reports">
              <CustomReportBuilder />
            </TabsContent>
          </>
        ) : (
          <div className={`p-8 text-center rounded-md ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <p>{projects?.length === 0 ? 
              'Create your first project to see analytics data' : 
              'Loading analytics data...'
            }</p>
          </div>
        )}
      </Tabs>
    </div>
  );
};
