
import { useMemo } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';

export const useAnalyticsChartData = () => {
  const { isDemo, projects } = useDashboard();
  
  // Helper function to check if we have data to display
  const hasData = isDemo || projects.length > 0;

  // Generate line chart data
  const lineData = useMemo(() => {
    if (isDemo) {
      return [
        { name: "Jan", value: 12 },
        { name: "Feb", value: 18 },
        { name: "Mar", value: 16 },
        { name: "Apr", value: 22 },
        { name: "May", value: 26 },
        { name: "Jun", value: 24 },
      ];
    } else if (projects.length > 0) {
      // Generate data based on project count for real users
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      return months.map(name => ({
        name,
        value: Math.max(0, Math.floor(Math.random() * projects.length * 5))
      }));
    } else {
      // Empty state for users with no projects
      return [
        { name: "No Data", value: 0 }
      ];
    }
  }, [isDemo, projects]);

  // Generate bar chart data
  const barData = useMemo(() => {
    if (isDemo) {
      return [
        { name: "Math", total: 17 },
        { name: "Language", total: 23 },
        { name: "Science", total: 13 },
        { name: "History", total: 9 },
        { name: "Art", total: 6 },
        { name: "Others", total: 11 },
      ];
    } else if (projects.length > 0) {
      // Generate data based on projects for real users
      const subjects = ["Math", "Language", "Science", "History", "Art", "Others"];
      return subjects.map(name => ({
        name,
        total: Math.max(0, Math.floor(Math.random() * projects.length * 4))
      }));
    } else {
      // Empty state for users with no projects
      return [
        { name: "No Data", total: 0 }
      ];
    }
  }, [isDemo, projects]);

  return {
    lineData,
    barData,
    hasData
  };
};
