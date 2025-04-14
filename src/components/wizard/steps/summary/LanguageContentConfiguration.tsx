
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConfigData } from '../../types';

interface LanguageContentConfigurationProps {
  data: ConfigData;
}

export const LanguageContentConfiguration: React.FC<LanguageContentConfigurationProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Language & Content Details</h3>
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Target Language</div>
                <div className="text-sm">{data.targetLanguage}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Goal</div>
                <div className="text-sm">{data.goal || 'Teaching'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Complexity</div>
                <div className="text-sm">{data.complexity || 'Intermediate'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Cultural Integration</div>
                <div className="text-sm">{data.culturalIntegration || 'Moderate'}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Terminology Style</div>
                <div className="text-sm">{data.terminology || 'Standard'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Content Markers</div>
                <div className="text-sm">{data.markers || 'Standard'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Structure</div>
                <div className="text-sm">{data.structure || 'Default'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Formatting</div>
                <div className="text-sm">{data.formatting || 'Default'}</div>
              </div>
            </div>
          </div>
          
          {data.standards && data.standards.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-2">Educational Standards</div>
              <div className="flex flex-wrap gap-2">
                {data.standards.map((standard, index) => (
                  <Badge key={index} variant="outline" className="bg-slate-50">
                    {standard}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {data.customStandards && data.customStandards.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-2">Custom Standards</div>
              <div className="flex flex-wrap gap-2">
                {data.customStandards.map((standard, index) => (
                  <Badge key={index} variant="outline" className="bg-slate-50">
                    {standard}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
