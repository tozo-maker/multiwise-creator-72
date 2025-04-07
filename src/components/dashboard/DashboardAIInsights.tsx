
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart, PieChart, TrendingUp, TrendingDown } from 'lucide-react';

interface AIInsight {
  id: string;
  title: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  percentage?: number;
  icon: React.ReactNode;
}

interface DashboardAIInsightsProps {
  insights?: AIInsight[];
  className?: string;
}

export const DashboardAIInsights: React.FC<DashboardAIInsightsProps> = ({ 
  insights,
  className
}) => {
  // Default insights if none provided
  const defaultInsights: AIInsight[] = [
    { 
      id: '1', 
      title: "Content Engagement", 
      description: "Student engagement increased by 24% this month",
      trend: 'up',
      percentage: 24,
      icon: <LineChart className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
    },
    { 
      id: '2', 
      title: "Project Activity", 
      description: "Most active projects: Spanish Textbook, French Workbook", 
      trend: 'neutral',
      icon: <BarChart className="h-5 w-5 text-blue-500 dark:text-blue-400" />
    },
    { 
      id: '3', 
      title: "Completion Rates", 
      description: "Project completion rate decreased by 5%",
      trend: 'down',
      percentage: 5,
      icon: <PieChart className="h-5 w-5 text-amber-500 dark:text-amber-400" />
    },
    { 
      id: '4', 
      title: "Content Performance", 
      description: "Visual content performs 37% better than text-only",
      trend: 'up',
      percentage: 37,
      icon: <BarChart className="h-5 w-5 text-violet-500 dark:text-violet-400" />
    }
  ];

  const displayInsights = insights || defaultInsights;

  const getTrendIcon = (trend: string, percentage?: number) => {
    if (trend === 'up') {
      return (
        <div className="flex items-center text-emerald-500 dark:text-emerald-400">
          <TrendingUp className="h-4 w-4 mr-1" />
          {percentage && <span>+{percentage}%</span>}
        </div>
      );
    } else if (trend === 'down') {
      return (
        <div className="flex items-center text-rose-500 dark:text-rose-400">
          <TrendingDown className="h-4 w-4 mr-1" />
          {percentage && <span>-{percentage}%</span>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${className}`}>
      <h2 className="text-xl font-semibold mb-3 dark:text-white">AI Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayInsights.map((insight) => (
          <Card key={insight.id} className="hover:shadow-md dark:hover:shadow-slate-800/30 transition-all border-slate-200 dark:border-slate-700 dark:bg-slate-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  {insight.icon}
                </div>
                {getTrendIcon(insight.trend, insight.percentage)}
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-slate-900 dark:text-white">{insight.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
