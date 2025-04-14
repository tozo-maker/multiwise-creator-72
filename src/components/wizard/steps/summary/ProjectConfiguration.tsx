
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookIcon } from 'lucide-react';
import { ConfigData } from '../../types';

interface ProjectConfigurationProps {
  data: ConfigData;
}

export const ProjectConfiguration: React.FC<ProjectConfigurationProps> = ({ data }) => {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <h4 className="text-md font-medium mb-4 flex items-center gap-2">
          <BookIcon className="h-5 w-5 text-slate-500" />
          Project Configuration
        </h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">Pedagogy</div>
            <div className="text-sm">{data.pedagogy === 'Custom' ? data.customPedagogy : data.pedagogy}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">Word Distribution</div>
            <div className="text-sm capitalize">{data.wordDistribution || 'balanced'}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">Word Enforcement</div>
            <div className="text-sm capitalize">{data.wordEnforcement || 'flexible'}</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm text-muted-foreground mb-2">Subjects</div>
          <div className="flex flex-wrap gap-2">
            {data.subjects && data.subjects.length > 0 ? (
              data.subjects.map((subject, index) => (
                <Badge key={index} variant="outline" className="bg-slate-50">
                  {subject}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-slate-500">None selected</span>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm text-muted-foreground mb-2">Educational Levels</div>
          <div className="flex flex-wrap gap-2">
            {data.levels && data.levels.length > 0 ? (
              data.levels.map((level, index) => (
                <Badge key={index} variant="outline" className="bg-slate-50">
                  {level}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-slate-500">None selected</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
