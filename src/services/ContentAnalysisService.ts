
import { supabase } from '@/integrations/supabase/client';
import { 
  ContentQualityAssessment, 
  ContentAnalysis, 
  ContentQualityMetrics,
  ReadabilityMetrics, 
  AccessibilityMetrics,
  ContentImprovementSuggestion,
  LearningObjectiveAlignment
} from '@/types/supabase-custom';

export type { 
  ContentQualityMetrics,
  ReadabilityMetrics,
  AccessibilityMetrics,
  ContentImprovementSuggestion,
  LearningObjectiveAlignment
};

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

  // Add new methods that are being called from components

  static async analyzeContentQuality(content: string, contentType: string, projectId: string): Promise<ContentQualityMetrics> {
    try {
      // Simulate AI analysis with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate random scores for demo
      const readabilityScore = Math.floor(Math.random() * 40) + 60;
      const engagementScore = Math.floor(Math.random() * 30) + 70;
      const alignmentScore = Math.floor(Math.random() * 40) + 60;
      const accessibilityScore = Math.floor(Math.random() * 20) + 80;
      const overallScore = Math.floor((readabilityScore + engagementScore + alignmentScore + accessibilityScore) / 4);
      
      const metrics: ContentQualityMetrics = {
        overallScore,
        readabilityScore,
        engagementScore,
        alignmentScore,
        accessibilityScore,
        strengths: [
          'Good use of examples to illustrate concepts.',
          'Clear structure with logical progression.',
          'Consistent tone throughout the content.'
        ],
        improvements: [
          'Some sentences are too long and could be simplified.',
          'Consider adding more visuals to support key points.',
          'Technical terms could be better explained for the target audience.'
        ]
      };
      
      return metrics;
    } catch (error) {
      console.error('Error analyzing content quality:', error);
      throw new Error('Failed to analyze content quality');
    }
  }

  static async generateImprovementSuggestions(content: string, contentType: string, projectId: string): Promise<ContentImprovementSuggestion[]> {
    try {
      // Simulate AI analysis with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Demo suggestions
      const suggestions: ContentImprovementSuggestion[] = [
        {
          title: 'Simplify complex sentences',
          description: 'Some sentences are too complex and could be broken down for better readability.',
          type: 'readability',
          priority: 'high',
          section: 'Introduction',
          originalText: 'The intricate nature of the subject matter necessitates a comprehensive understanding of the underlying principles that govern the interactions between various components.',
          suggestedText: 'This subject is complex. To understand it, you need to know the basic principles of how the components work together.'
        },
        {
          title: 'Add more examples',
          description: 'Adding real-world examples would help illustrate abstract concepts.',
          type: 'engagement',
          priority: 'medium',
          section: 'Main Content'
        },
        {
          title: 'Improve heading structure',
          description: 'The content would benefit from more clear and descriptive headings.',
          type: 'structure',
          priority: 'medium'
        },
        {
          title: 'Add alt text for images',
          description: 'Images should have descriptive alt text for screen readers.',
          type: 'accessibility',
          priority: 'high'
        }
      ];
      
      return suggestions;
    } catch (error) {
      console.error('Error generating improvement suggestions:', error);
      throw new Error('Failed to generate improvement suggestions');
    }
  }

  static async analyzeReadability(content: string, projectId: string): Promise<ReadabilityMetrics> {
    try {
      // Simulate AI analysis with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Demo metrics
      const metrics: ReadabilityMetrics = {
        fleschKincaidScore: Math.floor(Math.random() * 40) + 60,
        fleschKincaidGradeLevel: Math.floor(Math.random() * 6) + 6,
        complexWordCount: Math.floor(Math.random() * 20) + 10,
        averageSentenceLength: Math.floor(Math.random() * 10) + 15,
        averageWordLength: Math.floor(Math.random() * 3) + 4,
        paragraphStructure: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as 'excellent' | 'good' | 'fair' | 'poor'
      };
      
      return metrics;
    } catch (error) {
      console.error('Error analyzing readability:', error);
      throw new Error('Failed to analyze readability');
    }
  }

  static async analyzeAccessibility(content: string, projectId: string): Promise<AccessibilityMetrics> {
    try {
      // Simulate AI analysis with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Demo metrics
      const metrics: AccessibilityMetrics = {
        overallRating: Math.floor(Math.random() * 40) + 60,
        screenReaderFriendliness: Math.floor(Math.random() * 30) + 70,
        semanticStructure: Math.floor(Math.random() * 40) + 60,
        keyboardNavigability: Math.floor(Math.random() * 20) + 80,
        colorContrastCompliance: Math.random() > 0.5,
        mediaAlternatives: Math.random() > 0.7,
        improvementAreas: [
          'Add alt text to images',
          'Improve heading hierarchy',
          'Ensure proper ARIA labels on interactive elements'
        ]
      };
      
      return metrics;
    } catch (error) {
      console.error('Error analyzing accessibility:', error);
      throw new Error('Failed to analyze accessibility');
    }
  }

  static async analyzeLearningObjectiveAlignment(
    content: string,
    learningObjectives: Array<{ id: string; text: string }>,
    projectId: string
  ): Promise<LearningObjectiveAlignment[]> {
    try {
      // Simulate AI analysis with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate results for each learning objective
      const results: LearningObjectiveAlignment[] = learningObjectives.map(objective => {
        const alignmentScore = Math.floor(Math.random() * 40) + 60;
        
        return {
          objectiveId: objective.id,
          objectiveText: objective.text,
          alignmentScore,
          gapAnalysis: `The content ${alignmentScore < 70 ? 'partially addresses' : 'adequately covers'} this objective, but ${alignmentScore < 80 ? 'could be improved with more specific examples and applications.' : 'is well-aligned with the learning goals.'}`,
          improvementSuggestions: [
            'Add more examples that directly relate to this learning objective.',
            'Consider adding assessment questions that test this specific objective.',
            'Include more practical applications to reinforce this concept.'
          ]
        };
      });
      
      return results;
    } catch (error) {
      console.error('Error analyzing learning objective alignment:', error);
      throw new Error('Failed to analyze learning objective alignment');
    }
  }

  static async saveAnalysisResults(
    contentId: string,
    projectId: string,
    analysisType: string,
    results: any
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('analysis_results')
        .insert({
          content_id: contentId,
          project_id: projectId,
          analysis_type: analysisType,
          results: results
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving analysis results:', error);
      throw new Error('Failed to save analysis results');
    }
  }
}
