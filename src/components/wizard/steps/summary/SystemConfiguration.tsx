
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Settings2Icon } from 'lucide-react';
import { ConfigData } from '../../types';

interface SystemConfigurationProps {
  data: ConfigData;
}

export const SystemConfiguration: React.FC<SystemConfigurationProps> = ({ data }) => {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <h4 className="text-md font-medium mb-4 flex items-center gap-2">
          <Settings2Icon className="h-5 w-5 text-slate-500" />
          System Configuration
        </h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">Interface Language</div>
            <div className="text-sm">{data.interfaceLanguage || 'English'}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">Experience Level</div>
            <div className="text-sm">{data.experienceLevel || 'Intermediate'}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">Interaction Mode</div>
            <div className="text-sm">{data.interactionMode || 'Guided'}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">Output Detail</div>
            <div className="text-sm">{data.outputDetail || 'Detailed'}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">System Behavior</div>
            <div className="text-sm">{data.systemBehavior || 'Balanced'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
