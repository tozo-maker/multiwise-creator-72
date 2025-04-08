
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, LineChart, FileBox } from 'lucide-react';

interface ProjectActivityFeedProps {
  activityItems: Array<{
    action: string;
    time: string;
    icon: React.ElementType;
  }>;
}

export const ProjectActivityFeed: React.FC<ProjectActivityFeedProps> = ({ activityItems }) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-slate-100">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activityItems.map((item, i) => (
            <div key={i} className="flex items-start pb-3 border-b border-slate-700 last:border-b-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3 flex-shrink-0">
                <item.icon className="h-4 w-4 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">{item.action}</p>
                <p className="text-xs text-slate-400">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
