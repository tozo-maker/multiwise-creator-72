
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, LineChart, FileBox } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectActivityFeedProps {
  activityItems: Array<{
    action: string;
    time: string;
    icon: React.ElementType;
  }>;
}

export const ProjectActivityFeed: React.FC<ProjectActivityFeedProps> = ({ activityItems }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Card className={isDark 
      ? "bg-slate-800 border-slate-700" 
      : "bg-white border-slate-200 shadow-sm"
    }>
      <CardHeader className="pb-2">
        <CardTitle className={`text-xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activityItems.map((item, i) => (
            <div key={i} className={`flex items-start pb-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} last:border-b-0 last:pb-0`}>
              <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} flex items-center justify-center mr-3 flex-shrink-0`}>
                <item.icon className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.action}</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
