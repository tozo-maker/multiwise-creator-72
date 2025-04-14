
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentQualityAnalysis } from './ContentQualityAnalysis';
import { ContentImprovementSuggestions } from './ContentImprovementSuggestions';
import { LearningObjectiveAlignmentAnalysis } from './LearningObjectiveAlignmentAnalysis';
import { ReadabilityAccessibilityMetrics } from './ReadabilityAccessibilityMetrics';
import { BarChart2, FileText, Target, Sparkles, BarChart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ContentInsightsProps {
  content: string;
  contentId: string;
  projectId: string;
  contentType: string;
  learningObjectives?: Array<{ id: string; text: string }>;
  onUpdateContent?: (content: string) => void;
}

export const ContentInsights: React.FC<ContentInsightsProps> = ({
  content,
  contentId,
  projectId,
  contentType,
  learningObjectives = [],
  onUpdateContent
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [activeTab, setActiveTab] = useState('quality');
  
  return (
    <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 size={18} />
          Content Insights & Analysis
        </CardTitle>
        <CardDescription>
          Improve your content with AI-powered analysis and suggestions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0 pb-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mx-4 my-2">
            <TabsTrigger value="quality" className="flex items-center gap-1">
              <BarChart size={15} />
              <span>Quality</span>
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-1">
              <Sparkles size={15} />
              <span>Suggestions</span>
            </TabsTrigger>
            <TabsTrigger value="alignment" className="flex items-center gap-1">
              <Target size={15} />
              <span>Alignment</span>
            </TabsTrigger>
            <TabsTrigger value="readability" className="flex items-center gap-1">
              <FileText size={15} />
              <span>Readability</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="quality" className="m-0 p-4 pt-0">
            <ContentQualityAnalysis
              content={content}
              contentId={contentId}
              projectId={projectId}
              contentType={contentType}
              onUpdateContent={onUpdateContent}
            />
          </TabsContent>
          
          <TabsContent value="suggestions" className="m-0 p-4 pt-0">
            <ContentImprovementSuggestions
              content={content}
              contentId={contentId}
              projectId={projectId}
              contentType={contentType}
              onUpdateContent={onUpdateContent}
            />
          </TabsContent>
          
          <TabsContent value="alignment" className="m-0 p-4 pt-0">
            <LearningObjectiveAlignmentAnalysis
              content={content}
              contentId={contentId}
              projectId={projectId}
              learningObjectives={learningObjectives}
              onUpdateContent={onUpdateContent}
            />
          </TabsContent>
          
          <TabsContent value="readability" className="m-0 p-4 pt-0">
            <ReadabilityAccessibilityMetrics
              content={content}
              contentId={contentId}
              projectId={projectId}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
