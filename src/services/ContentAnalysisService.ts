
import { supabase } from '@/integrations/supabase/client';
import { AIService } from './AIService';
import { AnthropicService } from './AnthropicService';
import { toast } from '@/hooks/use-toast';

// Define the interface that comes from AnthropicService
interface ContentQualityAssessment {
  readabilityScore: number;
  accessibilityScore: number;
  engagementScore: number;
  alignmentScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  // The improvements property might not exist in the response from AnthropicService
  improvements?: string[];
}

export interface ContentQualityMetrics {
  readabilityScore: number;
  accessibilityScore: number;
  engagementScore: number;
  alignmentScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[]; // Required property
}

export interface LearningObjectiveAlignment {
  objectiveId: string;
  objectiveText: string;
  alignmentScore: number;
  gapAnalysis: string;
  improvementSuggestions: string[];
}

export interface ContentImprovementSuggestion {
  type: 'clarity' | 'engagement' | 'structure' | 'accessibility' | 'readability';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  originalText?: string;
  suggestedText?: string;
  section?: string;
}

export interface ReadabilityMetrics {
  fleschKincaidScore: number;
  fleschKincaidGradeLevel: number;
  averageSentenceLength: number;
  averageWordLength: number;
  complexWordCount: number;
  paragraphStructure: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface AccessibilityMetrics {
  screenReaderFriendliness: number;
  colorContrastCompliance: boolean;
  semanticStructure: number;
  mediaAlternatives: boolean;
  keyboardNavigability: number;
  overallRating: number;
  improvementAreas: string[];
}

export const ContentAnalysisService = {
  /**
   * Analyze content quality and generate comprehensive metrics
   */
  async analyzeContentQuality(
    content: string,
    contentType: string,
    projectId: string
  ): Promise<ContentQualityMetrics> {
    try {
      // Use AnthropicService to analyze content quality
      const results = await AnthropicService.analyzeContentQuality(
        content,
        contentType,
        [], // Learning objectives (optional)
        '', // Target audience (optional)
        projectId
      );
      
      // Convert the AnthropicService response to ContentQualityMetrics
      const metrics: ContentQualityMetrics = {
        readabilityScore: results.readabilityScore,
        accessibilityScore: results.accessibilityScore,
        engagementScore: results.engagementScore,
        alignmentScore: results.alignmentScore,
        overallScore: results.overallScore,
        strengths: results.strengths,
        weaknesses: results.weaknesses,
        improvements: results.improvements || [] // Ensure this property exists by providing a default empty array
      };
      
      return metrics;
    } catch (error) {
      console.error('Error analyzing content quality:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not analyze content quality. Please try again.',
        variant: 'destructive'
      });

      // Return default metrics in case of failure
      return {
        readabilityScore: 0,
        accessibilityScore: 0,
        engagementScore: 0,
        alignmentScore: 0,
        overallScore: 0,
        strengths: [],
        weaknesses: [],
        improvements: [] // Include the required property
      };
    }
  },

  /**
   * Generate improvement suggestions based on content analysis
   */
  async generateImprovementSuggestions(
    content: string,
    contentType: string,
    projectId: string,
    focusAreas?: ('clarity' | 'engagement' | 'structure' | 'accessibility' | 'readability')[]
  ): Promise<ContentImprovementSuggestion[]> {
    try {
      const systemPrompt = `Analyze the provided ${contentType} content and generate specific, actionable improvement suggestions.
      ${focusAreas ? `Focus especially on: ${focusAreas.join(', ')}.` : ''}
      
      For each suggestion, provide:
      1. Type (one of: clarity, engagement, structure, accessibility, readability)
      2. A brief title for the suggestion
      3. A detailed description explaining the issue
      4. Priority level (low, medium, high)
      5. The original problematic text (if applicable)
      6. Suggested improvement text (if applicable)
      7. The section where this applies (if identifiable)
      
      Format your response as a JSON array of objects with these fields.`;

      const result = await AIService.generateContent({
        prompt: content,
        systemPrompt,
        contentType: 'analysis',
        projectId
      });

      // Parse the JSON from the response
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse improvement suggestions');
    } catch (error) {
      console.error('Error generating improvement suggestions:', error);
      toast({
        title: 'Suggestion Generation Failed',
        description: 'Could not generate improvement suggestions.',
        variant: 'destructive'
      });
      
      return [];
    }
  },

  /**
   * Analyze content alignment with learning objectives
   */
  async analyzeLearningObjectiveAlignment(
    content: string,
    learningObjectives: { id: string; text: string }[],
    projectId: string
  ): Promise<LearningObjectiveAlignment[]> {
    try {
      if (!learningObjectives.length) {
        return [];
      }

      const systemPrompt = `Analyze how well the provided educational content aligns with the following learning objectives:
      ${learningObjectives.map(obj => `- ${obj.text}`).join('\n')}
      
      For each learning objective, provide:
      1. A numerical alignment score (0-100)
      2. A brief gap analysis explaining where the content meets or falls short of the objective
      3. 1-3 specific improvement suggestions to better align with the objective
      
      Format your response as a JSON array of objects with these fields: objectiveId, objectiveText, alignmentScore, gapAnalysis, improvementSuggestions.`;

      const result = await AIService.generateContent({
        prompt: content,
        systemPrompt,
        contentType: 'analysis',
        projectId
      });

      // Parse the JSON from the response
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsedResults = JSON.parse(jsonMatch[0]);
        
        // Map the results to include the objective IDs
        return parsedResults.map((item: any, index: number) => ({
          ...item,
          objectiveId: learningObjectives[index]?.id || `objective-${index}`,
          objectiveText: learningObjectives[index]?.text || item.objectiveText
        }));
      }
      
      throw new Error('Failed to parse learning objective alignment');
    } catch (error) {
      console.error('Error analyzing learning objective alignment:', error);
      toast({
        title: 'Alignment Analysis Failed',
        description: 'Could not analyze learning objective alignment.',
        variant: 'destructive'
      });
      
      return learningObjectives.map(obj => ({
        objectiveId: obj.id,
        objectiveText: obj.text,
        alignmentScore: 0,
        gapAnalysis: 'Analysis failed',
        improvementSuggestions: ['Try analyzing with shorter content or fewer objectives']
      }));
    }
  },

  /**
   * Analyze readability metrics for the content
   */
  async analyzeReadability(content: string, projectId: string): Promise<ReadabilityMetrics> {
    try {
      const systemPrompt = `Analyze the readability of the provided content. Calculate:
      
      1. Flesch-Kincaid Readability Score (0-100)
      2. Flesch-Kincaid Grade Level
      3. Average sentence length (in words)
      4. Average word length (in characters)
      5. Number of complex words (3+ syllables)
      6. Paragraph structure rating (poor, fair, good, excellent) based on length and organization
      
      Format your response as a JSON object with these fields.`;

      const result = await AIService.generateContent({
        prompt: content,
        systemPrompt,
        contentType: 'analysis',
        projectId
      });

      // Parse the JSON from the response
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse readability metrics');
    } catch (error) {
      console.error('Error analyzing readability:', error);
      toast({
        title: 'Readability Analysis Failed',
        description: 'Could not analyze content readability.',
        variant: 'destructive'
      });
      
      return {
        fleschKincaidScore: 50,
        fleschKincaidGradeLevel: 10,
        averageSentenceLength: 15,
        averageWordLength: 4.5,
        complexWordCount: 0,
        paragraphStructure: 'fair'
      };
    }
  },

  /**
   * Analyze accessibility metrics for the content
   */
  async analyzeAccessibility(content: string, projectId: string): Promise<AccessibilityMetrics> {
    try {
      const systemPrompt = `Analyze the accessibility of the provided educational content. Evaluate:
      
      1. Screen reader friendliness (0-100) based on text structure and potential for alt text
      2. Color contrast compliance (boolean) based on text descriptions and any color references
      3. Semantic structure quality (0-100) based on headings, lists, etc.
      4. Media alternatives presence (boolean) based on references to images, videos, etc.
      5. Keyboard navigability (0-100) based on interactive elements described
      6. Overall accessibility rating (0-100)
      7. List of specific improvement areas
      
      Format your response as a JSON object with these fields.`;

      const result = await AIService.generateContent({
        prompt: content,
        systemPrompt,
        contentType: 'analysis',
        projectId
      });

      // Parse the JSON from the response
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse accessibility metrics');
    } catch (error) {
      console.error('Error analyzing accessibility:', error);
      toast({
        title: 'Accessibility Analysis Failed',
        description: 'Could not analyze content accessibility.',
        variant: 'destructive'
      });
      
      return {
        screenReaderFriendliness: 50,
        colorContrastCompliance: false,
        semanticStructure: 50,
        mediaAlternatives: false,
        keyboardNavigability: 50,
        overallRating: 50,
        improvementAreas: ['Analysis failed']
      };
    }
  },

  /**
   * Save analysis results to database
   */
  async saveAnalysisResults(
    contentId: string,
    projectId: string,
    analysisType: string,
    results: any
  ) {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase
        .from('analysis_results')
        .insert({
          user_id: user.user.id,
          project_id: projectId,
          analysis_type: analysisType,
          results,
          metadata: {
            content_id: contentId,
            timestamp: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving analysis results:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error saving analysis results:', error);
      throw error;
    }
  },

  /**
   * Get previous analysis results for a content item
   */
  async getAnalysisHistory(contentId: string, analysisType?: string): Promise<any[]> {
    try {
      let query = supabase
        .from('analysis_results')
        .select('*')
        .filter('metadata->content_id', 'eq', contentId);
        
      if (analysisType) {
        query = query.eq('analysis_type', analysisType);
      }
      
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching analysis history:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching analysis history:', error);
      return [];
    }
  }
};
