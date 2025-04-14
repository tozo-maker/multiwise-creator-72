import React, { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfigData } from '../types';
import { DocumentInsightService } from '@/services/document-insights';

interface DocumentInsightIntegrationProps {
  data: ConfigData;
  updateData: (data: Partial<ConfigData>) => void;
}

export const DocumentInsightIntegration: React.FC<DocumentInsightIntegrationProps> = ({ 
  data,
  updateData
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load document insights when component mounts
  useEffect(() => {
    const fetchInsights = async () => {
      if (!data.projectId || !data.uploadedDocuments || data.uploadedDocuments.length === 0) {
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get insights for each uploaded document
        const insightPromises = data.uploadedDocuments.map(doc => 
          DocumentInsightService.getByFileId(doc.id)
        );
        
        const results = await Promise.all(insightPromises);
        const validInsights = results.filter(Boolean);
        
        setInsights(validInsights);
        
        // Update configuration based on insights if we found any
        if (validInsights.length > 0) {
          applyInsightsToConfiguration(validInsights);
        }
      } catch (error) {
        console.error('Error fetching document insights:', error);
        setError('Failed to load document insights');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInsights();
  }, [data.uploadedDocuments, data.projectId]);
  
  // Apply document insights to configuration settings
  const applyInsightsToConfiguration = (documentInsights: any[]) => {
    const configUpdates: Partial<ConfigData> = {};
    
    // Extract data from insights that can be used for configuration
    let detectedLanguage: string | null = null;
    let detectedComplexity: string | null = null;
    let keyTerms: string[] = [];
    
    documentInsights.forEach(insight => {
      // Track language detection
      if (insight.language_detected && !detectedLanguage) {
        detectedLanguage = insight.language_detected;
      }
      
      // Track complexity level
      if (insight.complexity_level) {
        const complexity = insight.complexity_level.toLowerCase();
        if (complexity === 'beginner') detectedComplexity = 'Beginner';
        if (complexity === 'intermediate') detectedComplexity = 'Intermediate';
        if (complexity === 'advanced' || complexity === 'expert') detectedComplexity = 'Advanced';
      }
      
      // Collect key terms/concepts
      if (insight.key_concepts && Array.isArray(insight.key_concepts)) {
        const terms = insight.key_concepts.map((concept: any) => {
          if (typeof concept === 'string') return concept;
          if (typeof concept === 'object' && (concept.concept || concept.term)) {
            return concept.concept || concept.term;
          }
          return null;
        }).filter(Boolean);
        
        keyTerms = [...keyTerms, ...terms];
      }
    });
    
    // Apply the detected values to configuration
    if (detectedLanguage) {
      // Capitalize first letter
      const formattedLanguage = detectedLanguage.charAt(0).toUpperCase() + detectedLanguage.slice(1).toLowerCase();
      configUpdates.targetLanguage = formattedLanguage;
    }
    
    if (detectedComplexity) {
      configUpdates.complexity = detectedComplexity;
    }
    
    // Only update if we have changes
    if (Object.keys(configUpdates).length > 0) {
      updateData(configUpdates);
    }
  };

  // Check if any insights were derived and applied
  const hasAppliedInsights = insights.length > 0;

  return (
    <div className="space-y-4">
      <Separator className="my-4" />
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Document Insights Integration</h3>
        <p className="text-sm text-muted-foreground">
          AI-derived insights from your documents can be applied to your project configuration.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-2">Analyzing your documents...</span>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : insights.length === 0 ? (
        data.uploadedDocuments && data.uploadedDocuments.length > 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No insights available</AlertTitle>
            <AlertDescription>
              Your documents haven't been analyzed yet. Analysis happens automatically in the background.
              Check back soon or continue with manual configuration.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No documents uploaded</AlertTitle>
            <AlertDescription>
              Upload documents in the previous step to leverage AI insights for your configuration.
            </AlertDescription>
          </Alert>
        )
      ) : (
        <div className="space-y-4">
          <Alert variant="default" className="border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Insights Applied</AlertTitle>
            <AlertDescription className="text-green-700">
              Document insights have been used to optimize your project configuration.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {data.targetLanguage && insights.some(i => i.language_detected) && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm font-medium mb-2">Target Language</div>
                <div className="flex items-center">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {data.targetLanguage}
                  </Badge>
                  <span className="ml-2 text-xs text-slate-500">
                    Detected from documents
                  </span>
                </div>
              </div>
            )}
            
            {data.complexity && insights.some(i => i.complexity_level) && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm font-medium mb-2">Content Complexity</div>
                <div className="flex items-center">
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    {data.complexity}
                  </Badge>
                  <span className="ml-2 text-xs text-slate-500">
                    Based on document analysis
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
