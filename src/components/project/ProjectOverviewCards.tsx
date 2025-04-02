
import React from 'react';
import { BookText, FileText, Target, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';

interface ProjectOverviewCardsProps {
  projectStats?: {
    contentItems: number;
    wordCount: number;
    targetWordCount: number;
    knowledgeBaseFiles: number;
    lastModified: string;
    lastModifiedTime: string;
  };
}

export const ProjectOverviewCards: React.FC<ProjectOverviewCardsProps> = ({ 
  projectStats = {
    contentItems: 3,
    wordCount: 2450,
    targetWordCount: 5000,
    knowledgeBaseFiles: 5,
    lastModified: '2h ago',
    lastModifiedTime: '2:45 PM'
  }
}) => {
  const wordCountPercentage = Math.round((projectStats.wordCount / projectStats.targetWordCount) * 100);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border border-slate-200 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Content Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-slate-800">{projectStats.contentItems}</div>
            <div className="p-2 rounded-full bg-brand-100">
              <BookText className="h-5 w-5 text-brand-600" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-slate-500">
            Target: 12 items
          </div>
        </CardFooter>
      </Card>
      
      <Card className="border border-slate-200 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Word Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-slate-800">{projectStats.wordCount.toLocaleString()}</div>
            <div className="p-2 rounded-full bg-brand-100">
              <FileText className="h-5 w-5 text-brand-600" />
            </div>
          </div>
          <Progress value={wordCountPercentage} className="h-1.5 mt-3 bg-slate-100" />
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-slate-500">
            {wordCountPercentage}% of {projectStats.targetWordCount.toLocaleString()} word target
          </div>
        </CardFooter>
      </Card>
      
      <Card className="border border-slate-200 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-slate-800">{projectStats.knowledgeBaseFiles}</div>
            <div className="p-2 rounded-full bg-brand-100">
              <Target className="h-5 w-5 text-brand-600" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-slate-500">
            Files available for context
          </div>
        </CardFooter>
      </Card>
      
      <Card className="border border-slate-200 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Last Modified</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-slate-800">{projectStats.lastModified}</div>
            <div className="p-2 rounded-full bg-brand-100">
              <Clock className="h-5 w-5 text-brand-600" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-slate-500">
            Last content update at {projectStats.lastModifiedTime}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
