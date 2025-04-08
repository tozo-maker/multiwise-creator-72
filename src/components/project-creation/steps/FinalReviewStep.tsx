
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

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
  updateData?: (data: Partial<typeof data>) => void;
  isMobile?: boolean;
}

export function FinalReviewStep({ data, updateData, isMobile = false }: FinalReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-brand-50 dark:bg-slate-800/50 border border-brand-200 dark:border-slate-700 p-4">
        <p className="text-brand-700 dark:text-slate-200 text-sm">
          Please review your project details before creation. You can edit these settings later.
        </p>
      </div>
      
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {data.name || "Untitled Project"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {data.description || "No description provided"}
              </p>
            </div>
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Project Details</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Template</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {data.templateId === 'blank' ? 'Blank Project' : data.templateId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Complexity</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{data.complexity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Language</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{data.language}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Audience</h4>
                  <div className="mt-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Target Audience</span>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">
                      {data.targetAudience || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Project Type</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.type ? (
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                    {data.type}
                  </Badge>
                ) : (
                  <span className="text-sm text-slate-500 dark:text-slate-400">No type specified</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 p-4 flex items-start gap-3">
        <div className="mt-0.5">
          <Check className="h-5 w-5 text-green-500 dark:text-green-400" />
        </div>
        <div>
          <h4 className="font-medium text-green-800 dark:text-green-400">Ready to create</h4>
          <p className="text-green-700 dark:text-green-500 text-sm mt-1">
            Your project is ready to be created. Click 'Create Project' to proceed.
          </p>
        </div>
      </div>
    </div>
  );
}
