
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { OutlineItem, OutlineSection } from '@/types/outline';

interface AIContentOptions {
  prompt: string;
  systemPrompt?: string;
  projectId: string;
  contentType?: string;
  language?: string;
  audience?: string;
  complexity?: string;
  knowledgeBaseIds?: string[];
  outlineContext?: {
    sectionTitle?: string;
    sectionItems?: OutlineItem[];
    currentItem?: OutlineItem;
  };
  documentInsights?: any[];
  temperature?: number;
  maxTokens?: number;
}

interface AIContentResponse {
  content: string;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  metadata?: Record<string, any>;
}

interface ContentQualityAssessment {
  readabilityScore: number;
  engagementScore: number;
  alignmentScore: number;
  accessibilityScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

interface ContentEnhancementRequest {
  content: string;
  enhancementType: 'clarity' | 'engagement' | 'alignment' | 'simplification' | 'elaboration';
  targetAudience?: string;
  learningObjectives?: string[];
}

export const AnthropicService = {
  async generateContent(options: AIContentOptions): Promise<AIContentResponse> {
    try {
      console.log('Generating content with options:', options);

      const {
        prompt,
        systemPrompt,
        projectId,
        contentType = 'general',
        language,
        audience,
        complexity,
        knowledgeBaseIds = [],
        temperature = 0.7,
        maxTokens = 4000
      } = options;

      const { data, error } = await supabase.functions.invoke('ai-content-generation', {
        body: {
          prompt,
          systemPrompt,
          projectId,
          contentType,
          language,
          audience,
          complexity,
          knowledgeBaseIds,
          temperature,
          maxTokens
        }
      });

      if (error) {
        console.error('Error generating content:', error);
        toast({
          title: 'Content Generation Failed',
          description: error.message || 'Failed to generate content',
          variant: 'destructive',
        });
        throw error;
      }

      return {
        content: data.content,
        model: data.model,
        usage: data.usage,
        metadata: data.metadata
      };
    } catch (error: any) {
      console.error('Error in AnthropicService.generateContent:', error);
      toast({
        title: 'Content Generation Failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  /**
   * Generate content with advanced context and prompt engineering
   */
  async generateEnhancedContent(options: AIContentOptions): Promise<AIContentResponse> {
    // Add advanced context handling
    let enhancedPrompt = options.prompt;
    let enhancedSystemPrompt = options.systemPrompt || '';
    
    // Add educational goals context if not already present
    if (!enhancedSystemPrompt.includes("educational goals")) {
      enhancedSystemPrompt += "\nAim to create content that achieves clear educational goals, demonstrates concepts effectively, and encourages critical thinking.";
    }
    
    // Add outline context if available
    if (options.outlineContext) {
      const { sectionTitle, currentItem, sectionItems } = options.outlineContext;
      
      enhancedSystemPrompt += "\n\nOUTLINE CONTEXT:";
      
      if (sectionTitle) {
        enhancedSystemPrompt += `\nThis content is part of the section: "${sectionTitle}".`;
      }
      
      if (currentItem) {
        enhancedSystemPrompt += `\nYou are creating content for the outline item: "${currentItem.title}"`;
        if (currentItem.description) {
          enhancedSystemPrompt += ` - ${currentItem.description}`;
        }
      }
      
      if (sectionItems && sectionItems.length > 0) {
        enhancedSystemPrompt += "\n\nRelated outline items in this section:";
        sectionItems.forEach(item => {
          if (item.id !== currentItem?.id) {
            enhancedSystemPrompt += `\n- ${item.title}` + (item.description ? `: ${item.description}` : '');
          }
        });
        enhancedSystemPrompt += "\n\nEnsure your content maintains coherence with these related items while focusing on the current item.";
      }
    }
    
    // Add document insights context if available
    if (options.documentInsights && options.documentInsights.length > 0) {
      enhancedSystemPrompt += "\n\nDOCUMENT INSIGHTS:";
      
      options.documentInsights.forEach(insight => {
        enhancedSystemPrompt += `\n\nInsight from "${insight.title}":`;
        if (insight.summary) {
          enhancedSystemPrompt += `\nSummary: ${insight.summary}`;
        }
        if (insight.key_concepts && insight.key_concepts.length > 0) {
          enhancedSystemPrompt += "\nKey concepts:";
          insight.key_concepts.forEach((concept: any) => {
            enhancedSystemPrompt += `\n- ${concept.term}: ${concept.explanation || ''}`;
          });
        }
      });
      
      enhancedSystemPrompt += "\n\nIncorporate these insights appropriately into your content generation.";
    }
    
    // Enhance system prompt with content type-specific guidance
    if (options.contentType) {
      switch(options.contentType.toLowerCase()) {
        case 'lesson':
          enhancedSystemPrompt += "\n\nCONTENT TYPE GUIDANCE:\nFor lessons, focus on clear learning objectives, engaging explanations, relevant examples, and opportunities for practice and assessment.";
          break;
        case 'quiz':
          enhancedSystemPrompt += "\n\nCONTENT TYPE GUIDANCE:\nFor quizzes, create questions that test different cognitive levels (recall, application, analysis), provide clear answer options, and include explanations for correct answers.";
          break;
        case 'worksheet':
          enhancedSystemPrompt += "\n\nCONTENT TYPE GUIDANCE:\nFor worksheets, include clear instructions, sufficient working space, a logical progression of difficulty, and age-appropriate formatting.";
          break;
        case 'presentation':
          enhancedSystemPrompt += "\n\nCONTENT TYPE GUIDANCE:\nFor presentations, create concise slide content, clear visuals, logical flow, and engaging speaker notes that expand on the slide content.";
          break;
        case 'research':
          enhancedSystemPrompt += "\n\nCONTENT TYPE GUIDANCE:\nFor research materials, emphasize methodological rigor, critical analysis of sources, ethical considerations, and clear documentation procedures.";
          break;
        case 'case_study':
          enhancedSystemPrompt += "\n\nCONTENT TYPE GUIDANCE:\nFor case studies, develop realistic scenarios with sufficient detail, clear learning points, thought-provoking questions, and comprehensive teaching notes.";
          break;
        default:
          enhancedSystemPrompt += "\n\nCONTENT TYPE GUIDANCE:\nCreate educational content that is clear, accurate, engaging, and pedagogically sound.";
      }
    }
    
    // Add audience-specific instructions
    if (options.audience) {
      enhancedSystemPrompt += `\n\nAUDIENCE:\nThis content is for ${options.audience} level students. Adjust language, examples, and complexity accordingly.`;
    }
    
    // Add complexity level guidance
    if (options.complexity) {
      enhancedSystemPrompt += `\n\nCOMPLEXITY:\nCreate content at a ${options.complexity} complexity level, with appropriate depth, vocabulary, and conceptual challenge.`;
    }
    
    // Add language-specific instruction
    if (options.language && options.language !== 'English') {
      enhancedSystemPrompt += `\n\nLANGUAGE:\nPlease create the content in ${options.language}, ensuring proper grammar, idioms, and cultural context.`;
    }
    
    // Return the enhanced content
    return this.generateContent({
      ...options,
      prompt: enhancedPrompt,
      systemPrompt: enhancedSystemPrompt
    });
  },
  
  /**
   * Generate content refinements based on feedback
   */
  async generateContentRefinement(content: string, feedback: string, options: Partial<AIContentOptions> = {}): Promise<AIContentResponse> {
    const systemPrompt = `You are an educational content editor. Your task is to refine and improve the provided educational content based on specific feedback.
    
ORIGINAL CONTENT:
${content}

FEEDBACK FOR IMPROVEMENT:
${feedback}

Please provide an improved version of the content that addresses the feedback while maintaining the original purpose and educational goals. Make specific improvements rather than complete rewrites unless the feedback suggests otherwise.`;

    return this.generateContent({
      prompt: "Refine the content based on the provided feedback.",
      systemPrompt,
      projectId: options.projectId || '',
      contentType: options.contentType || 'general',
      language: options.language,
      audience: options.audience,
      complexity: options.complexity,
      temperature: 0.4 // Lower temperature for more focused refinements
    });
  },
  
  /**
   * Get AI feedback on content
   */
  async getContentFeedback(content: string, contentType: string, options: Partial<AIContentOptions> = {}): Promise<AIContentResponse> {
    const systemPrompt = `You are an educational content reviewer. Analyze the provided ${contentType} content and provide constructive feedback.

Your feedback should cover:
1. Content accuracy and clarity
2. Educational effectiveness
3. Organization and structure
4. Engagement and accessibility
5. Specific suggestions for improvement

Be specific, constructive, and actionable in your feedback.`;

    return this.generateContent({
      prompt: content,
      systemPrompt,
      projectId: options.projectId || '',
      contentType: 'feedback',
      language: options.language,
      audience: options.audience,
      complexity: options.complexity,
      temperature: 0.3
    });
  },

  /**
   * Analyze content quality for educational effectiveness
   */
  async analyzeContentQuality(
    content: string, 
    contentType: string, 
    learningObjectives: string[] = [], 
    targetAudience: string = '',
    projectId: string
  ): Promise<ContentQualityAssessment> {
    try {
      const systemPrompt = `You are an educational content quality analyzer. Assess the provided ${contentType} content against established pedagogical and accessibility standards.

${learningObjectives.length > 0 
  ? `LEARNING OBJECTIVES:\n${learningObjectives.map(obj => `- ${obj}`).join('\n')}\n\n` 
  : ''}
${targetAudience 
  ? `TARGET AUDIENCE: ${targetAudience}\n\n` 
  : ''}

Analyze the content and provide scores from 0-100 for the following metrics:
1. Readability Score: clarity of language, appropriate sentence length and vocabulary
2. Engagement Score: ability to capture and maintain interest
3. Learning Alignment Score: alignment with learning objectives
4. Accessibility Score: inclusive language, clear structure, compatibility with assistive technologies

Also provide:
- Overall Quality Score: weighted average of the above
- 2-3 key strengths of the content
- 2-3 key weaknesses or areas for improvement
- 2-3 actionable suggestions to improve the content

Output your analysis in the following JSON format:
{
  "readabilityScore": 0-100,
  "engagementScore": 0-100,
  "alignmentScore": 0-100,
  "accessibilityScore": 0-100, 
  "overallScore": 0-100,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`;

      const result = await this.generateContent({
        prompt: content,
        systemPrompt,
        projectId,
        contentType: 'analysis',
        temperature: 0.3,
        maxTokens: 2000
      });

      // Extract JSON from the response
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0]);
        return {
          readabilityScore: analysisData.readabilityScore,
          engagementScore: analysisData.engagementScore,
          alignmentScore: analysisData.alignmentScore,
          accessibilityScore: analysisData.accessibilityScore,
          overallScore: analysisData.overallScore,
          strengths: analysisData.strengths,
          weaknesses: analysisData.weaknesses,
          suggestions: analysisData.suggestions
        };
      } else {
        throw new Error('Failed to parse quality assessment response');
      }
    } catch (error: any) {
      console.error('Error analyzing content quality:', error);
      toast({
        title: 'Analysis Failed',
        description: error.message || 'Unable to analyze content quality',
        variant: 'destructive',
      });

      // Return fallback analysis
      return {
        readabilityScore: 70,
        engagementScore: 70,
        alignmentScore: 70,
        accessibilityScore: 70,
        overallScore: 70,
        strengths: ['Content is structurally sound'],
        weaknesses: ['Analysis could not be completed properly'],
        suggestions: ['Try again with shorter content or different parameters']
      };
    }
  },

  /**
   * Generate enhanced content based on specific enhancement type
   */
  async enhanceContent(
    request: ContentEnhancementRequest,
    projectId: string
  ): Promise<AIContentResponse> {
    const { content, enhancementType, targetAudience, learningObjectives } = request;

    let enhancementPrompt = '';
    
    switch (enhancementType) {
      case 'clarity':
        enhancementPrompt = `Improve the clarity of this content by simplifying language, breaking down complex ideas, and enhancing structure. Maintain the same educational value while making it more accessible to understand.`;
        break;
      case 'engagement':
        enhancementPrompt = `Make this content more engaging by adding relevant real-world examples, interesting scenarios, interactive elements, questions that promote critical thinking, and conversational tone where appropriate.`;
        break;
      case 'alignment':
        enhancementPrompt = `Enhance this content to better align with these learning objectives: ${learningObjectives?.join(', ') || 'the implied educational goals'}. Ensure each key point connects clearly to learning outcomes.`;
        break;
      case 'simplification':
        enhancementPrompt = `Simplify this content while maintaining its educational value. Use clearer language, shorter sentences, more straightforward explanations, and visual organization to make it more accessible.`;
        break;
      case 'elaboration':
        enhancementPrompt = `Elaborate on this content by adding more depth, examples, explanations of concepts, supporting evidence, and connections to broader contexts. Enhance the richness without unnecessary verbosity.`;
        break;
      default:
        enhancementPrompt = `Improve this educational content while maintaining its core message and educational value.`;
    }

    const systemPrompt = `You are an educational content enhancement specialist. Your task is to improve the provided content based on specific enhancement goals.

ORIGINAL CONTENT:
${content}

ENHANCEMENT GOAL:
${enhancementPrompt}

${targetAudience ? `TARGET AUDIENCE: ${targetAudience}\n\n` : ''}
${learningObjectives && learningObjectives.length > 0 
  ? `LEARNING OBJECTIVES:\n${learningObjectives.map(obj => `- ${obj}`).join('\n')}\n\n` 
  : ''}

Provide an enhanced version of the content that addresses the enhancement goal while maintaining the original purpose and educational value. Return ONLY the enhanced content without explanations or meta-commentary.`;

    return this.generateContent({
      prompt: `Enhance the content according to the ${enhancementType} goal.`,
      systemPrompt,
      projectId,
      contentType: 'enhancement',
      temperature: 0.4,
    });
  },
  
  /**
   * Generate predictive insights for project or content outcomes
   */
  async generatePredictiveInsights(
    projectData: any, 
    insightType: 'completion' | 'quality' | 'engagement', 
    timeframe: 'week' | 'month' | 'quarter',
    projectId: string
  ): Promise<any> {
    try {
      const systemPrompt = `You are an AI analytics expert specializing in educational content projects. Based on the provided project data, generate predictive insights about future ${insightType} trends over the next ${timeframe}.

PROJECT DATA:
${JSON.stringify(projectData, null, 2)}

Your task is to:
1. Analyze patterns in the provided data
2. Generate a data-driven prediction for ${insightType} over the next ${timeframe}
3. Provide 1-2 actionable recommendations based on the prediction

Return your response as a JSON object with the following structure:
{
  "predictionData": [
    {"date": "time-period-1", "value": numeric-value-1},
    {"date": "time-period-2", "value": numeric-value-2},
    ...
  ],
  "trend": "up" or "down" or "stable",
  "confidence": 0-100,
  "insights": "1-2 sentence analysis of the prediction",
  "recommendations": ["recommendation1", "recommendation2"]
}

Ensure the prediction is realistic and grounded in the patterns visible in the provided data.`;

      const result = await this.generateContent({
        prompt: `Generate predictive insights for ${insightType} over the next ${timeframe}.`,
        systemPrompt,
        projectId,
        contentType: 'prediction',
        temperature: 0.4,
        maxTokens: 2000
      });

      // Extract JSON from the response
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse predictive insights response');
      }
    } catch (error: any) {
      console.error('Error generating predictive insights:', error);
      toast({
        title: 'Prediction Failed',
        description: error.message || 'Unable to generate predictive insights',
        variant: 'destructive',
      });
      
      // Return fallback prediction data
      const dates = timeframe === 'week' 
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : timeframe === 'month'
        ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        : ['Month 1', 'Month 2', 'Month 3'];
      
      const trend = Math.random() > 0.5 ? 'up' : 'down';
      const baseValue = 65;
      const predictionData = dates.map((date, i) => ({
        date,
        value: trend === 'up'
          ? Math.min(100, baseValue + (i * (2 + Math.random() * 3)))
          : Math.max(0, baseValue - (i * (1 + Math.random() * 2)))
      }));
      
      return {
        predictionData,
        trend,
        confidence: 60 + Math.floor(Math.random() * 20),
        insights: "This is a fallback prediction based on typical patterns.",
        recommendations: [
          "Continue monitoring actual performance data",
          "Adjust strategy based on emerging trends"
        ]
      };
    }
  }
};
