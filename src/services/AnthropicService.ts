
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
  }
};
