
import React from 'react';
import { useAnalyticsChartData } from '../hooks/useAnalyticsChartData';
import { ChartCard } from './ChartCard';
import { ProjectDistributionBarChart } from './ProjectDistributionBarChart';

export const ProjectDistributionSection = () => {
  const { barData, hasData } = useAnalyticsChartData();
  
  return (
    <ChartCard 
      title="Project Distribution" 
      description="Projects by subject area"
    >
      <ProjectDistributionBarChart data={barData} hasData={hasData} />
    </ChartCard>
  );
};
