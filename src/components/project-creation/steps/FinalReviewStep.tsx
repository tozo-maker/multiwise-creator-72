
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
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-medium">Ready to Create Your Project</h3>
        <p className="text-muted-foreground mt-1">
          Review your project details before creating
        </p>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-4">
            <dl className="space-y-2">
              <div className="flex justify-between py-1 border-b">
                <dt className="text-muted-foreground">Project Name</dt>
                <dd className="font-medium">{data.name || 'Untitled Project'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-muted-foreground">Project Type</dt>
                <dd>{getProjectType() || 'Not specified'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-muted-foreground">Language</dt>
                <dd>{data.language}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-muted-foreground">Target Audience</dt>
                <dd>{getAudienceLabel() || 'Not specified'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-muted-foreground">Complexity</dt>
                <dd>{data.complexity}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-muted-foreground">Template</dt>
                <dd>
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
          <Card>
            <CardContent className="pt-4">
              <h4 className="text-sm font-medium mb-2">Description</h4>
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
