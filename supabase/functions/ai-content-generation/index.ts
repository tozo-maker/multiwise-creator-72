
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle OPTIONS requests for CORS
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    })
  }
  return null
}

// Generate educational prompt based on content type
const generatePrompt = (contentType: string, basePrompt: string, context: string | null): string => {
  let specificInstructions = '';
  
  switch(contentType.toLowerCase()) {
    case 'lesson':
      specificInstructions = 'Format the content as a complete lesson with learning objectives, introduction, main content sections, activities, and summary.';
      break;
    case 'quiz':
      specificInstructions = 'Create a well-structured quiz with multiple-choice questions, each having 4 options with one correct answer marked. Include an answer key at the end.';
      break;
    case 'summary':
      specificInstructions = 'Create a concise summary that captures the key points and main ideas. Use bullet points for clarity where appropriate.';
      break;
    case 'exercise':
      specificInstructions = 'Design practice exercises with clear instructions, example problems with solutions, and additional problems for independent practice.';
      break;
    default:
      specificInstructions = 'Create well-structured educational content with clear sections, examples, and explanatory text.';
  }
  
  let fullPrompt = `${basePrompt}\n\n${specificInstructions}`;
  
  if (context) {
    fullPrompt += `\n\nPlease incorporate information from the following context: ${context}`;
  }
  
  return fullPrompt;
};

// Process knowledge base files to extract context
const extractContextFromFiles = async (supabase: any, fileIds: string[]): Promise<string> => {
  if (!fileIds || fileIds.length === 0) return '';
  
  const { data: files, error } = await supabase
    .from('knowledge_base_files')
    .select('name, description')
    .in('id', fileIds);
    
  if (error || !files || files.length === 0) {
    console.log('No context files found or error:', error);
    return '';
  }
  
  return files.map(file => `${file.name}: ${file.description || 'No description'}`).join('\n\n');
};

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Get API key from environment
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key is not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse request body
    const { prompt, projectId, contentType, language, audience, complexity, knowledgeBaseIds = [] } = await req.json()

    // Validate required inputs
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing required prompt parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!projectId) {
      return new Response(
        JSON.stringify({ error: 'Missing required projectId parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get knowledge base context if available
    let knowledgeBaseContext = '';
    if (knowledgeBaseIds.length > 0) {
      knowledgeBaseContext = await extractContextFromFiles(supabase, knowledgeBaseIds);
    }

    // Format the system prompt based on content parameters
    let systemPrompt = `You are an expert educational content creator specializing in ${contentType || 'educational'} content.`;
    
    // Add language specification if provided
    if (language) {
      systemPrompt += ` Create content in ${language}.`;
    }
    
    // Add audience targeting if provided
    if (audience) {
      systemPrompt += ` Target audience: ${audience}.`;
    }
    
    // Add complexity level if provided
    if (complexity) {
      systemPrompt += ` Complexity level: ${complexity}.`;
    }
    
    // Generate enhanced prompt with content type specific instructions
    const enhancedPrompt = generatePrompt(contentType, prompt, knowledgeBaseContext);

    console.log('Calling Anthropic API with system prompt:', systemPrompt);
    console.log('Enhanced user prompt:', enhancedPrompt);

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Anthropic API error:', errorText)
      return new Response(
        JSON.stringify({ error: `Anthropic API error: ${response.status}` }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const result = await response.json()
    
    console.log('Anthropic response received')
    
    // Return the generated content with metadata
    return new Response(
      JSON.stringify({ 
        content: result.content[0].text,
        model: result.model,
        usage: result.usage,
        metadata: {
          contentType,
          language,
          audience,
          complexity,
          timestamp: new Date().toISOString(),
          projectId
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
