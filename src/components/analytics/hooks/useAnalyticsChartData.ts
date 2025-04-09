
import { useMemo } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';

export const useAnalyticsChartData = () => {
  const { projects, activityData, contentGenerationData } = useDashboard();
  
  // Helper function to check if we have data to display
  const hasData = projects.length > 0;

  // Use real activity data for line chart
  const lineData = useMemo(() => {
    if (activityData && activityData.length > 0) {
      return activityData;
    } else {
      // Empty state for users with no data
      return [
        { name: "No Data", value: 0 }
      ];
    }
  }, [activityData]);

  // Generate bar chart data from real projects
  const barData = useMemo(() => {
    if (!hasData) {
      return [{ name: "No Data", total: 0 }];
    }
    
    // Group projects by type and count them
    const typeMap = new Map<string, number>();
    
    projects.forEach(project => {
      const type = project.type || 'Other';
      const count = typeMap.get(type) || 0;
      typeMap.set(type, count + 1);
    });
    
    // Convert to array format needed for the chart
    return Array.from(typeMap.entries()).map(([name, count]) => ({
      name,
      total: count
    }));
  }, [projects, hasData]);

  return {
    lineData,
    barData,
    hasData
  };
};
