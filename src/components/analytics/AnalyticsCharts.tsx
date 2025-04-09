
import React from 'react';
import { ProjectActivitySection } from './charts/ProjectActivitySection';
import { ProjectDistributionSection } from './charts/ProjectDistributionSection';

// This component is lazy-loaded in the Analytics page for better performance
export const AnalyticsCharts = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-4">
        <ProjectActivitySection />
      </div>
      <div className="col-span-3">
        <ProjectDistributionSection />
      </div>
    </div>
  );
};

export default AnalyticsCharts;
