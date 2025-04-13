
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeCard } from '@/components/shared/ThemeCard';

interface KeyConcept {
  concept: string;
  relevance: number;
}

interface DocumentInsight {
  id: string;
  title: string;
  summary: string;
  key_concepts: KeyConcept[];
  sentiment_score: number;
  complexity_level: string;
  language_detected: string;
}

interface DocumentInsightsProps {
  insight?: DocumentInsight;
  isLoading?: boolean;
  fileName?: string;
  onProcessDocument?: () => void;
}

export const DocumentInsights: React.FC<DocumentInsightsProps> = ({
  insight,
  isLoading = false,
  fileName = 'Document',
  onProcessDocument
}) => {
  const { isDark } = useTheme();
  
  // Convert sentiment score to descriptive text and color
  const getSentiment = (score: number) => {
    if (score >= 0.7) return { text: 'Very Positive', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' };
    if (score >= 0.5) return { text: 'Positive', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' };
    if (score >= 0.4) return { text: 'Neutral', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' };
    if (score >= 0.2) return { text: 'Negative', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' };
    return { text: 'Very Negative', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' };
  };

  if (isLoading) {
    return (
      <ThemeCard>
        <CardHeader>
          <CardTitle>Document Insights</CardTitle>
          <CardDescription>Analyzing document content...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          </div>
        </CardContent>
      </ThemeCard>
    );
  }

  if (!insight) {
    return (
      <ThemeCard>
        <CardHeader>
          <CardTitle>Document Insights</CardTitle>
          <CardDescription>No analysis available for this document</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">{fileName}</h3>
            <p className="text-slate-500 mb-6">This document hasn't been analyzed yet.</p>
            
            {onProcessDocument && (
              <button
                onClick={onProcessDocument}
                className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors"
              >
                Process Document
              </button>
            )}
          </div>
        </CardContent>
      </ThemeCard>
    );
  }

  const sentimentInfo = getSentiment(insight.sentiment_score);

  return (
    <ThemeCard>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{insight.title}</CardTitle>
            <CardDescription>AI-generated document analysis</CardDescription>
          </div>
          <Badge variant="outline" className={sentimentInfo.color}>
            {sentimentInfo.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="concepts">Key Concepts</TabsTrigger>
            <TabsTrigger value="details">Technical Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Document Summary</h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {insight.summary}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="concepts" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Key Concepts</h3>
              <div className="flex flex-wrap gap-2">
                {insight.key_concepts.map((concept, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <Badge 
                      variant="secondary" 
                      className="text-sm py-1"
                    >
                      {concept.concept}
                      <span className="ml-1 text-xs opacity-70">
                        {Math.round(concept.relevance * 100)}%
                      </span>
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-500 mb-1">Language</h4>
                <p className="font-medium">{insight.language_detected}</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-500 mb-1">Complexity</h4>
                <p className="font-medium">{insight.complexity_level}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </ThemeCard>
  );
};
