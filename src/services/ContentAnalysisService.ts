
import { supabase } from '@/integrations/supabase/client';
import { ContentQualityAssessment, ContentAnalysis } from '@/types/supabase-custom';

export interface AnalysisResult {
  id: string;
  readabilityScore: number;
  quality: {
    score: number;
    details: {
      clarity: number;
      engagement: number;
      accuracy: number;
    };
  };
  suggestions: string[];
  improvements?: string[];
}

export class ContentAnalysisService {
  static async analyzeContent(content: string, targetLevel: string): Promise<AnalysisResult> {
    try {
      // In a real app, this would call an AI service or API
      console.log('Analyzing content for target level:', targetLevel);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate random scores for demo
      const readabilityScore = Math.floor(Math.random() * 40) + 60;
      const clarityScore = Math.floor(Math.random() * 30) + 70;
      const engagementScore = Math.floor(Math.random() * 40) + 60;
      const accuracyScore = Math.floor(Math.random() * 20) + 80;
      const qualityScore = Math.floor((clarityScore + engagementScore + accuracyScore) / 3);
      
      const result: AnalysisResult = {
        id: Math.random().toString(36).substring(7),
        readabilityScore,
        quality: {
          score: qualityScore,
          details: {
            clarity: clarityScore,
            engagement: engagementScore,
            accuracy: accuracyScore,
          },
        },
        suggestions: [
          'Consider simplifying sentences in paragraph 2.',
          'Add more examples to clarify complex concepts.',
          'Review technical terms for consistency.',
        ],
        improvements: [
          'Added visual elements could improve engagement.',
          'Consider breaking long paragraphs into smaller chunks.',
        ],
      };
      
      return result;
    } catch (error) {
      console.error('Error analyzing content:', error);
      throw new Error('Failed to analyze content');
    }
  }

  static async saveAnalysisResult(contentId: string, analysisResult: AnalysisResult): Promise<void> {
    try {
      const { error } = await supabase
        .from('content_analysis')
        .insert({
          content_id: contentId,
          readability_score: analysisResult.readabilityScore,
          quality_score: analysisResult.quality.score,
          clarity_score: analysisResult.quality.details.clarity,
          engagement_score: analysisResult.quality.details.engagement,
          accuracy_score: analysisResult.quality.details.accuracy,
          suggestions: analysisResult.suggestions,
          improvements: analysisResult.improvements || [], // Use empty array as fallback
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving analysis result:', error);
      throw new Error('Failed to save analysis result');
    }
  }

  static async getContentQualityAssessment(contentId: string): Promise<ContentQualityAssessment> {
    try {
      const { data, error } = await supabase
        .from('content_quality_assessments')
        .select('*')
        .eq('content_id', contentId)
        .single();
      
      if (error) throw error;
      
      return data as ContentQualityAssessment;
    } catch (error) {
      console.error('Error getting content quality assessment:', error);
      throw new Error('Failed to get content quality assessment');
    }
  }

  static async getImprovementSuggestions(contentId: string): Promise<string[]> {
    try {
      const assessment = await this.getContentQualityAssessment(contentId);
      return assessment?.improvements ?? []; // Use nullish coalescing to provide empty array fallback
    } catch (error) {
      console.error('Error getting improvement suggestions:', error);
      return [];
    }
  }

  static async getContentAnalysis(contentId: string): Promise<ContentAnalysis | null> {
    try {
      const { data, error } = await supabase
        .from('content_analysis')
        .select('*')
        .eq('content_id', contentId)
        .single();
      
      if (error) throw error;
      
      return data as ContentAnalysis;
    } catch (error) {
      console.error('Error getting content analysis:', error);
      return null;
    }
  }
}
