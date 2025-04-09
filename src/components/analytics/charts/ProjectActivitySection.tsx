
import React from 'react';
import { useAnalyticsChartData } from '../hooks/useAnalyticsChartData';
import { ChartCard } from './ChartCard';
import { ProjectActivityLineChart } from './ProjectActivityLineChart';

export const ProjectActivitySection = () => {
  const { lineData, hasData } = useAnalyticsChartData();
  
  return (
    <ChartCard 
      title="Project Activity" 
      description="Monthly project activity and content generation"
    >
      <ProjectActivityLineChart data={lineData} hasData={hasData} />
    </ChartCard>
  );
};
