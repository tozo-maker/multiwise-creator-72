
import { supabase } from '@/integrations/supabase/client';

export interface AnthropicGenerationOptions {
  prompt: string;
  projectId: string;
  contentType: string;
  language?: string;
  audience?: string;
  complexity?: string;
  knowledgeBaseIds?: string[];
  temperature?: number;
  maxTokens?: number;
}

export interface AnthropicResponse {
  content: string;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export const AnthropicService = {
  async generateContent(options: AnthropicGenerationOptions): Promise<AnthropicResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-generation', {
        body: options
      });

      if (error) {
        console.error('Error calling AI generation:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error in Anthropic content generation:', error);
      throw error;
    }
  },

  async processDocument(fileId: string, projectId: string): Promise<any> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase.functions.invoke('process-document', {
        body: {
          fileId,
          projectId,
          userId: user.user.id
        }
      });

      if (error) {
        console.error('Error processing document:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error in document processing:', error);
      throw error;
    }
  },
  
  async saveGeneratedContent(
    projectId: string, 
    title: string, 
    content: string, 
    type: string,
    status: 'draft' | 'completed' | 'in-review' = 'draft'
  ) {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase
        .from('content_items')
        .insert({
          project_id: projectId,
          user_id: user.user.id,
          title,
          type,
          content,
          status
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving content item:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error saving content:', error);
      throw error;
    }
  }
};
