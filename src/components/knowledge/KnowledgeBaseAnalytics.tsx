
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChartHorizontal, Files, FileText, HardDrive } from 'lucide-react';

interface KBAnalyticsItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

interface KnowledgeBaseAnalyticsProps {
  totalFiles: number;
  totalSize: string;
  fileTypes: { [key: string]: number };
}

export const KnowledgeBaseAnalytics: React.FC<KnowledgeBaseAnalyticsProps> = ({
  totalFiles,
  totalSize,
  fileTypes
}) => {
  const analytics: KBAnalyticsItem[] = [
    {
      label: 'Total Documents',
      value: totalFiles,
      icon: <Files className="h-4 w-4 text-blue-500" />
    },
    {
      label: 'Total Size',
      value: totalSize,
      icon: <HardDrive className="h-4 w-4 text-green-500" />
    },
    {
      label: 'Most Common Type',
      value: Object.entries(fileTypes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A',
      icon: <FileText className="h-4 w-4 text-purple-500" />
    },
    {
      label: 'File Type Distribution',
      value: Object.keys(fileTypes).length,
      icon: <BarChartHorizontal className="h-4 w-4 text-orange-500" />
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Knowledge Base Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {analytics.map((item, index) => (
            <div key={index} className="flex items-start space-x-2 p-2 rounded-md border bg-slate-50">
              <div className="p-2 rounded-full bg-white border">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{item.value}</p>
                <p className="text-xs text-slate-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
