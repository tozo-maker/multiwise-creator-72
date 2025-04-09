
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { ThemeTable, ThemeTableCell, TableHeader, TableRow, TableHead, TableBody } from '@/components/shared/ThemeTable';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface KnowledgeBaseAnalyticsProps {
  totalFiles: number;
  totalSize: string;
  fileTypes: Record<string, number>;
}

export const KnowledgeBaseAnalytics: React.FC<KnowledgeBaseAnalyticsProps> = ({
  totalFiles,
  totalSize,
  fileTypes
}) => {
  const { isDark } = useTheme();
  
  // Convert fileTypes object to array for charts
  const fileTypeData = Object.entries(fileTypes).map(([name, value]) => ({
    name,
    value
  }));
  
  const COLORS = ['#6c54f0', '#5a3ae5', '#4c2cc9', '#3f28a3', '#362780', '#211751', '#8E9196'];
  
  // Group small file types into "Others" for better visualization
  const getPieChartData = () => {
    if (fileTypeData.length <= 5) return fileTypeData;
    
    const sorted = [...fileTypeData].sort((a, b) => b.value - a.value);
    const topTypes = sorted.slice(0, 4);
    const others = sorted.slice(4).reduce(
      (acc, curr) => ({ name: 'Others', value: acc.value + curr.value }),
      { name: 'Others', value: 0 }
    );
    
    return [...topTypes, others];
  };
  
  const pieData = getPieChartData();
  
  // Stats cards data
  const statsCards = [
    { title: 'Total Files', value: totalFiles.toString(), color: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-700 dark:text-blue-300' },
    { title: 'Total Size', value: totalSize, color: 'bg-purple-50 dark:bg-purple-900/20', textColor: 'text-purple-700 dark:text-purple-300' },
    { title: 'File Types', value: Object.keys(fileTypes).length.toString(), color: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-700 dark:text-green-300' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <ThemeCard key={index} className={`${card.color}`}>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">{card.title}</h3>
                <p className={`text-3xl font-bold mt-2 ${card.textColor}`}>{card.value}</p>
              </div>
            </CardContent>
          </ThemeCard>
        ))}
      </div>
      
      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File types distribution */}
        <ThemeCard>
          <CardHeader>
            <CardTitle className="text-lg">File Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {fileTypeData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} files`, 'Count']}
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1e293b' : 'white',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        color: isDark ? 'white' : 'black'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">
                No file types data available
              </div>
            )}
          </CardContent>
        </ThemeCard>
        
        {/* File types bar chart */}
        <ThemeCard>
          <CardHeader>
            <CardTitle className="text-lg">File Count by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {fileTypeData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={fileTypeData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis 
                      dataKey="name"
                      tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1e293b' : 'white',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        color: isDark ? 'white' : 'black'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Files" fill="#6c54f0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">
                No file types data available
              </div>
            )}
          </CardContent>
        </ThemeCard>
      </div>
      
      {/* File types table */}
      <ThemeCard>
        <CardHeader>
          <CardTitle className="text-lg">File Type Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeTable>
            <TableHeader>
              <TableRow>
                <TableHead>File Type</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fileTypeData.length > 0 ? (
                fileTypeData.map((type, index) => (
                  <TableRow key={index}>
                    <ThemeTableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        {type.name.toUpperCase()}
                      </div>
                    </ThemeTableCell>
                    <ThemeTableCell>{type.value}</ThemeTableCell>
                    <ThemeTableCell>
                      {((type.value / totalFiles) * 100).toFixed(1)}%
                    </ThemeTableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <ThemeTableCell colSpan={3} className="text-center py-8 text-slate-500">
                    No file types data available
                  </ThemeTableCell>
                </TableRow>
              )}
            </TableBody>
          </ThemeTable>
        </CardContent>
      </ThemeCard>
    </div>
  );
};
