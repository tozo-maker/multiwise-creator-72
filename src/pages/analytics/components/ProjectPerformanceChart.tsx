
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart } from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard } from '@/contexts/DashboardContext';

export const ProjectPerformanceChart = () => {
  const { isDark } = useTheme();
  const { contentGenerationData, activityData, isDemo, projects } = useDashboard();
  const [performanceData, setPerformanceData] = useState([]);
  
  useEffect(() => {
    if (contentGenerationData && activityData) {
      // Only process data if user is demo or has projects
      if (isDemo || projects.length > 0) {
        // Create a mapping of months/days to their respective values
        const contentMap = contentGenerationData.reduce((acc, item) => {
          acc[item.date] = item.count;
          return acc;
        }, {});
        
        const activityMap = activityData.reduce((acc, item) => {
          acc[item.name] = item.value;
          return acc;
        }, {});
        
        // Generate performance data for the chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        if (isDemo) {
          // Use demo data with randomization
          const newPerformanceData = months.map(month => {
            const contentValue = contentMap[month] || 0;
            const baseEngagement = Math.min(100, Math.max(50, 40 + contentValue * 2));
            const baseCompletion = Math.min(100, Math.max(30, 30 + contentValue * 1.5));
            const baseProgress = Math.min(100, Math.max(20, 20 + contentValue));
            
            return {
              month,
              engagement: Math.round(baseEngagement),
              completion: Math.round(baseCompletion),
              progress: Math.round(baseProgress)
            };
          });
          setPerformanceData(newPerformanceData);
        } else {
          // For real users with projects, use actual content generation data
          const newPerformanceData = months.map(month => {
            const count = contentMap[month] || 0;
            return {
              month,
              engagement: count > 0 ? Math.round(count * 2 + 10) : 0,
              completion: count > 0 ? Math.round(count * 1.5 + 5) : 0,
              progress: count > 0 ? Math.round(count + 15) : 0
            };
          });
          setPerformanceData(newPerformanceData);
        }
      } else {
        // For real users with no projects, show empty data
        setPerformanceData([
          { month: 'No Data', engagement: 0, completion: 0, progress: 0 }
        ]);
      }
    }
  }, [contentGenerationData, activityData, isDemo, projects]);
  
  return (
    <Card className="border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-800/30 transition-shadow dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <LineChart className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          Project Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={performanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={isDark ? 0.1 : 0.15} stroke={isDark ? "#475569" : undefined} />
              <XAxis dataKey="month" stroke={isDark ? "#94a3b8" : undefined} />
              <YAxis stroke={isDark ? "#94a3b8" : undefined} />
              <Tooltip contentStyle={isDark ? { backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' } : undefined} />
              <Legend />
              <Bar dataKey="engagement" name="Engagement" fill="#8884d8" />
              <Bar dataKey="completion" name="Completion" fill="#82ca9d" />
              <Line type="monotone" dataKey="progress" name="Progress" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
