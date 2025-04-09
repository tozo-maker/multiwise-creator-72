
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, FileText, Globe, Users, BrainCircuit } from 'lucide-react';

interface FinalReviewStepProps {
  data: {
    name: string;
    description: string;
    type: string;
    language: string;
    targetAudience: string;
    complexity: string;
    templateId: string;
    quickStart?: string;
    hasKnowledgeBase?: boolean;
    knowledgeBaseFiles?: string[];
  };
  updateData?: (data: Partial<FinalReviewStepProps['data']>) => void;
  isMobile?: boolean;
}

export function FinalReviewStep({ data, updateData, isMobile = false }: FinalReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-brand-50 dark:bg-slate-800/50 border border-brand-200 dark:border-slate-700 p-4">
        <p className="text-brand-700 dark:text-slate-300 text-sm">
          Please review your project details before creation. You can edit these settings later.
        </p>
      </div>
      
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
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
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <FileText className="h-4 w-4" />
                    Project Details
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Template</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                        {data.quickStart === 'custom' ? 'Custom Project' : data.quickStart}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Project Type</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                        {data.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Complexity</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                        {data.complexity}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Globe className="h-4 w-4" />
                    Language Settings
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Language</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                        {data.language}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Users className="h-4 w-4" />
                    Audience
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Target Audience</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                        {data.targetAudience || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <BrainCircuit className="h-4 w-4" />
                    Knowledge Base
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                        {data.hasKnowledgeBase ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    {data.hasKnowledgeBase && data.knowledgeBaseFiles && data.knowledgeBaseFiles.length > 0 && (
                      <div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Files</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {data.knowledgeBaseFiles.map((file, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {file}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 p-4 flex items-start gap-3">
        <div className="mt-0.5">
          <Check className="h-5 w-5 text-green-500" />
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
