
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
import { ProjectService } from '@/services/ProjectService';

export const ProjectPerformanceChart = () => {
  const { isDark } = useTheme();
  const { projects } = useDashboard();
  const [performanceData, setPerformanceData] = useState([]);
  
  useEffect(() => {
    const getPerformanceData = async () => {
      if (projects.length === 0) {
        setPerformanceData([
          { month: 'No Data', engagement: 0, completion: 0, progress: 0 }
        ]);
        return;
      }

      try {
        // Calculate average progress across projects
        const avgProgress = projects.reduce((sum, project) => sum + (project.progress || 0), 0) / projects.length;
        
        // Create data based on project creation dates
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const projectsByMonth = {};
        
        // Initialize month data
        months.forEach(month => {
          projectsByMonth[month] = 0;
        });
        
        // Group projects by month
        projects.forEach(project => {
          const date = new Date(project.lastModified);
          const month = months[date.getMonth()];
          projectsByMonth[month] = (projectsByMonth[month] || 0) + 1;
        });
        
        // Generate performance data based on real projects
        const data = months.map(month => {
          const count = projectsByMonth[month] || 0;
          return {
            month,
            engagement: count * 10,
            completion: count * 8,
            progress: count > 0 ? avgProgress : 0
          };
        });
        
        setPerformanceData(data);
      } catch (error) {
        console.error('Error calculating performance data:', error);
        setPerformanceData([
          { month: 'Error', engagement: 0, completion: 0, progress: 0 }
        ]);
      }
    };
    
    getPerformanceData();
  }, [projects]);
  
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
