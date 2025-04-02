
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileEdit, FileText, Upload, Save, Download, Clock, Check } from 'lucide-react';

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
  // Default activities if none provided
  const defaultActivities: ActivityItem[] = [
    { 
      id: '1', 
      project: "Spanish Language Textbook", 
      action: "Content generated", 
      time: "2 hours ago",
      icon: <FileEdit className="h-4 w-4 text-emerald-500" />
    },
    { 
      id: '2', 
      project: "French Beginner Workbook", 
      action: "Project configuration updated", 
      time: "1 day ago",
      icon: <Check className="h-4 w-4 text-indigo-500" />
    },
    { 
      id: '3', 
      project: "Chinese Characters Guide", 
      action: "Knowledge base file added", 
      time: "3 days ago",
      icon: <Upload className="h-4 w-4 text-blue-500" />
    },
    { 
      id: '4', 
      project: "German Grammar Worksheets", 
      action: "Snapshot created", 
      time: "1 week ago",
      icon: <Save className="h-4 w-4 text-amber-500" />
    },
    { 
      id: '5', 
      project: "English Teaching Guide", 
      action: "Project exported", 
      time: "2 weeks ago",
      icon: <Download className="h-4 w-4 text-violet-500" />
    }
  ];

  const displayActivities = activities || defaultActivities;

  return (
    <Card className={`${className} border border-slate-200 hover:shadow-md transition-shadow`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <CardDescription>Your recent project activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex items-start pb-3 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 flex-shrink-0">
                {activity.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{activity.project}</p>
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-xs text-slate-500">{activity.action}</p>
                  <span className="text-xs text-slate-400">•</span>
                  <div className="flex items-center text-xs text-slate-400">
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
