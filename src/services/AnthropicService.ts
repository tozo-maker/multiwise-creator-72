
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AIContentOptions {
  prompt: string;
  systemPrompt?: string;
  projectId: string;
  contentType?: string;
  language?: string;
  audience?: string;
  complexity?: string;
  knowledgeBaseIds?: string[];
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
    
    // Enhance system prompt with content type-specific guidance
    if (options.contentType) {
      switch(options.contentType.toLowerCase()) {
        case 'lesson':
          enhancedSystemPrompt += "\nFor lessons, focus on clear learning objectives, engaging explanations, relevant examples, and opportunities for practice and assessment.";
          break;
        case 'quiz':
          enhancedSystemPrompt += "\nFor quizzes, create questions that test different cognitive levels (recall, application, analysis), provide clear answer options, and include explanations for correct answers.";
          break;
        case 'worksheet':
          enhancedSystemPrompt += "\nFor worksheets, include clear instructions, sufficient working space, a logical progression of difficulty, and age-appropriate formatting.";
          break;
        case 'presentation':
          enhancedSystemPrompt += "\nFor presentations, create concise slide content, clear visuals, logical flow, and engaging speaker notes that expand on the slide content.";
          break;
        case 'research':
          enhancedSystemPrompt += "\nFor research materials, emphasize methodological rigor, critical analysis of sources, ethical considerations, and clear documentation procedures.";
          break;
        case 'case_study':
          enhancedSystemPrompt += "\nFor case studies, develop realistic scenarios with sufficient detail, clear learning points, thought-provoking questions, and comprehensive teaching notes.";
          break;
        default:
          enhancedSystemPrompt += "\nCreate educational content that is clear, accurate, engaging, and pedagogically sound.";
      }
    }
    
    // Add audience-specific instructions
    if (options.audience) {
      enhancedSystemPrompt += `\nThis content is for ${options.audience} level students. Adjust language, examples, and complexity accordingly.`;
    }
    
    // Add complexity level guidance
    if (options.complexity) {
      enhancedSystemPrompt += `\nCreate content at a ${options.complexity} complexity level, with appropriate depth, vocabulary, and conceptual challenge.`;
    }
    
    // Add language-specific instruction
    if (options.language && options.language !== 'English') {
      enhancedSystemPrompt += `\nPlease create the content in ${options.language}, ensuring proper grammar, idioms, and cultural context.`;
    }
    
    // Return the enhanced content
    return this.generateContent({
      ...options,
      prompt: enhancedPrompt,
      systemPrompt: enhancedSystemPrompt
    });
  }
};
