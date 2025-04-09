
import { supabase } from '@/integrations/supabase/client';

interface ContentGenerationInput {
  prompt: string;
  contentType: string;
  language?: string;
  audience?: string;
  complexity?: string;
}

export const AIService = {
  async generateContent(input: ContentGenerationInput): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-generation', {
        body: input,
      });

      if (error) {
        console.error('Error calling AI generation:', error);
        throw new Error(error.message);
      }

      return data.content;
    } catch (error) {
      console.error('Error in AI content generation:', error);
      throw error;
    }
  },

  async saveContentItem(
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
