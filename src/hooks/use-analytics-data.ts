
import { useQuery } from '@tanstack/react-query';
import { ContentAnalysisService } from '@/services/ContentAnalysisService';
import { useState, useCallback } from 'react';

type AnalyticsDataType = 'quality' | 'readability' | 'accessibility' | 'performance';

export function useAnalyticsData(projectId: string, dataType: AnalyticsDataType = 'quality') {
  const [selectedMetric, setSelectedMetric] = useState<string>('overall');
  
  // This function will help reduce unnecessary renders
  const updateSelectedMetric = useCallback((metric: string) => {
    setSelectedMetric(metric);
  }, []);

  // Use react-query for efficient data fetching, caching, and background updates
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics', projectId, dataType],
    queryFn: async () => {
      switch (dataType) {
        case 'quality':
          return ContentAnalysisService.analyzeContentQuality(
            'Sample content for analysis', // This would come from actual content in a real app
            'article',
            projectId
          );
        case 'readability':
          return ContentAnalysisService.analyzeReadability(
            'Sample content for analysis',
            projectId
          );
        case 'accessibility':
          return ContentAnalysisService.analyzeAccessibility(
            'Sample content for analysis',
            projectId
          );
        case 'performance':
          // Mock data for performance metrics
          return {
            loadingTime: Math.floor(Math.random() * 500) + 100,
            renderingTime: Math.floor(Math.random() * 200) + 50,
            timeToInteractive: Math.floor(Math.random() * 800) + 200,
            cacheHitRate: Math.floor(Math.random() * 50) + 50,
          };
        default:
          throw new Error(`Unknown analytics data type: ${dataType}`);
      }
    },
    staleTime: 60000, // Data remains fresh for 1 minute
    gcTime: 300000, // Cache data for 5 minutes (replacing cacheTime with gcTime)
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    selectedMetric,
    updateSelectedMetric,
  };
}
