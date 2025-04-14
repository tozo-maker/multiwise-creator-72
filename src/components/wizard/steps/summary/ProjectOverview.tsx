
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, BookIcon, GlobeIcon } from 'lucide-react';
import { ConfigData } from '../../types';

interface ProjectOverviewProps {
  data: ConfigData;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ data }) => {
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get template name based on quickStart selection
  const getTemplateName = () => {
    switch (data.quickStart) {
      case 'custom': return 'Custom Configuration';
      case 'template': return 'Template';
      case 'duplicate': return 'Duplicated Project';
      case 'primary-math': return 'Primary Mathematics';
      case 'secondary-science': return 'Secondary Science';
      case 'language-learning': return 'Language Learning';
      case 'teacher-guide': return 'Teacher Guide';
      default: return data.quickStart;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Project Overview</h3>
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Project Name</div>
                <div className="text-lg font-semibold">{data.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Creation Date</div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-slate-500" />
                  <span>{formatDate(data.createdDate)}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Template Type</div>
                <div className="flex items-center gap-2">
                  <BookIcon className="h-4 w-4 text-slate-500" />
                  <span>{getTemplateName()}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Project Type</div>
                <div>{data.projectType === 'Custom' ? data.customProjectType : data.projectType}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Language</div>
                <div className="flex items-center gap-2">
                  <GlobeIcon className="h-4 w-4 text-slate-500" />
                  <span>{data.targetLanguage}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Word Count Target</div>
                <div>{data.wordCount.toLocaleString()} words</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
