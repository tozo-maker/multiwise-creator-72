
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileEdit, FileText, Upload, Save, Download, Clock, Check, AlertCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard } from '@/contexts/DashboardContext';

interface ActivityItem {
  id: string;
  project: string;
  action: string;
  time: string;
  icon: React.ReactNode;
}

interface DashboardActivityTimelineProps {
  activities?: ActivityItem[];
  className?: string;
}

export const DashboardActivityTimeline: React.FC<DashboardActivityTimelineProps> = ({ 
  activities,
  className 
}) => {
  const { theme } = useTheme();
  const { isDemo, projects } = useDashboard();
  const isDark = theme === 'dark';
  
  // Default activities for demo users
  const defaultActivities: ActivityItem[] = [
    { 
      id: '1', 
      project: "Spanish Language Textbook", 
      action: "Content generated", 
      time: "2 hours ago",
      icon: <FileEdit className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
    },
    { 
      id: '2', 
      project: "French Beginner Workbook", 
      action: "Project configuration updated", 
      time: "1 day ago",
      icon: <Check className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
    },
    { 
      id: '3', 
      project: "Chinese Characters Guide", 
      action: "Knowledge base file added", 
      time: "3 days ago",
      icon: <Upload className="h-4 w-4 text-blue-500 dark:text-blue-400" />
    },
    { 
      id: '4', 
      project: "German Grammar Worksheets", 
      action: "Snapshot created", 
      time: "1 week ago",
      icon: <Save className="h-4 w-4 text-amber-500 dark:text-amber-400" />
    },
    { 
      id: '5', 
      project: "English Teaching Guide", 
      action: "Project exported", 
      time: "2 weeks ago",
      icon: <Download className="h-4 w-4 text-violet-500 dark:text-violet-400" />
    }
  ];

  // Empty state for real users with no data
  const emptyActivities: ActivityItem[] = [
    { 
      id: '1', 
      project: "No projects yet", 
      action: "Create your first project to get started", 
      time: "Now",
      icon: <AlertCircle className="h-4 w-4 text-slate-500 dark:text-slate-400" />
    }
  ];

  // Use provided activities, or select between default and empty activities
  const displayActivities = activities || (isDemo ? defaultActivities : (projects.length > 0 ? defaultActivities : emptyActivities));

  return (
    <Card className={`${className} border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow ${
      isDark 
        ? 'dark:hover:shadow-slate-800/30 dark:bg-slate-800 backdrop-blur-sm' 
        : 'hover:shadow-slate-200/30 bg-white'
    }`}>
      <CardHeader>
        <CardTitle className={`text-lg font-semibold ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>Recent Activity</CardTitle>
        <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          {isDemo || projects.length > 0 ? 'Your recent project activities' : 'No recent activities'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <div 
              key={activity.id} 
              className={`flex items-start pb-3 border-b last:border-0 last:pb-0 ${
                isDark ? 'border-slate-700' : 'border-slate-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                isDark ? 'bg-slate-700' : 'bg-slate-100'
              }`}>
                {activity.icon}
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>{activity.project}</p>
                <div className="flex items-center gap-1 mt-1">
                  <p className={`text-xs ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>{activity.action}</p>
                  <span className={`text-xs ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>•</span>
                  <div className={`flex items-center text-xs ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
