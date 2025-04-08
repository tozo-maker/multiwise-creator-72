
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface FinalReviewStepProps {
  data: {
    name: string;
    description: string;
    type: string;
    language: string;
    targetAudience: string;
    complexity: string;
    templateId: string;
  };
  updateData: (data: Record<string, any>) => void;
  isMobile?: boolean;
}

export function FinalReviewStep({ data, updateData, isMobile = false }: FinalReviewStepProps) {
  const getProjectType = () => {
    const types: Record<string, string> = {
      'textbook': 'Textbook',
      'course': 'Course',
      'lesson': 'Lesson Plan',
      'assessment': 'Assessment',
      'worksheet': 'Worksheet',
      'other': 'Other'
    };
    return types[data.type] || data.type;
  };
  
  const getAudienceLabel = () => {
    const audiences: Record<string, string> = {
      'elementary': 'Elementary School',
      'middle': 'Middle School',
      'high': 'High School',
      'undergraduate': 'Undergraduate',
      'graduate': 'Graduate',
      'professional': 'Professional',
      'general': 'General Audience'
    };
    return audiences[data.targetAudience] || data.targetAudience;
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-medium text-slate-900 dark:text-slate-50">Ready to Create Your Project</h3>
        <p className="text-muted-foreground mt-1">
          Review your project details before creating
        </p>
      </div>
      
      <div className="space-y-4">
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="pt-4">
            <dl className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <dt className="text-muted-foreground">Project Name</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">{data.name || 'Untitled Project'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <dt className="text-muted-foreground">Project Type</dt>
                <dd className="text-slate-700 dark:text-slate-300">{getProjectType() || 'Not specified'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <dt className="text-muted-foreground">Language</dt>
                <dd className="text-slate-700 dark:text-slate-300">{data.language}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <dt className="text-muted-foreground">Target Audience</dt>
                <dd className="text-slate-700 dark:text-slate-300">{getAudienceLabel() || 'Not specified'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <dt className="text-muted-foreground">Complexity</dt>
                <dd className="text-slate-700 dark:text-slate-300">{data.complexity}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-muted-foreground">Template</dt>
                <dd className="text-slate-700 dark:text-slate-300">
                  {data.templateId === 'blank' && 'Blank Project'}
                  {data.templateId === 'curriculum' && 'Educational Curriculum'}
                  {data.templateId === 'language' && 'Language Learning'}
                  {data.templateId === 'assessment' && 'Assessment Tools'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        {data.description && (
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardContent className="pt-4">
              <h4 className="text-sm font-medium mb-2 text-slate-900 dark:text-slate-100">Description</h4>
              <p className="text-sm text-muted-foreground">
                {data.description}
              </p>
            </CardContent>
          </Card>
        )}
        
        <div className="text-center text-sm text-muted-foreground pt-2">
          <p>You can modify all these settings later from your project workspace.</p>
        </div>
      </div>
    </div>
  );
}
