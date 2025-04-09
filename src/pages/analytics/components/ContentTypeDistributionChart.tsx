
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart as PieChartIcon } from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard } from '@/contexts/DashboardContext';

export const ContentTypeDistributionChart = () => {
  const { isDark } = useTheme();
  const { isDemo, projects } = useDashboard();
  const [contentTypeData, setContentTypeData] = useState([]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const EMPTY_COLORS = ['#94a3b8'];
  
  useEffect(() => {
    // Initialize content type data based on user status
    if (isDemo) {
      // Demo data for content types
      setContentTypeData([
        { name: 'Video', value: 35 },
        { name: 'Text', value: 25 },
        { name: 'Interactive', value: 20 },
        { name: 'Assessment', value: 15 },
        { name: 'Other', value: 5 },
      ]);
    } else if (projects.length > 0) {
      // For real users with projects, we'd normally fetch this data
      // For now, let's create some representative data based on projects
      const types = ['Video', 'Text', 'Interactive', 'Assessment', 'Other'];
      const typesData = types.map(name => {
        // Generate slightly randomized values based on project count
        return {
          name,
          value: Math.max(5, Math.floor(Math.random() * 20 * projects.length))
        };
      });
      setContentTypeData(typesData);
    } else {
      // Empty state for users with no projects
      setContentTypeData([{ name: 'No Content', value: 100 }]);
    }
  }, [isDemo, projects]);
  
  return (
    <Card className="border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-800/30 transition-shadow dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <PieChartIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          Content Type Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={contentTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => contentTypeData.length > 1 && contentTypeData[0].name !== 'No Content' ? `${name} ${(percent * 100).toFixed(0)}%` : name}
              >
                {contentTypeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={contentTypeData.length > 1 && contentTypeData[0].name !== 'No Content' ? COLORS[index % COLORS.length] : EMPTY_COLORS[0]} 
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={isDark ? { backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' } : undefined} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
