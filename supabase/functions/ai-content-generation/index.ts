
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
    const { prompt, projectId, contentType, knowledgeBaseIds = [] } = await req.json()

    // Validate input
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

    // Get knowledge base files for context (if any)
    let knowledgeBaseContext = ''
    if (knowledgeBaseIds.length > 0) {
      const { data: files, error } = await supabase
        .from('knowledge_base_files')
        .select('name, description, url')
        .in('id', knowledgeBaseIds)

      if (error) {
        console.error('Error fetching knowledge base files:', error)
      } else if (files && files.length > 0) {
        knowledgeBaseContext = 'Reference materials:\n' + files.map(file => 
          `- ${file.name}: ${file.description || 'No description'} (${file.url})`
        ).join('\n')
      }
    }

    // Format the system prompt based on content type
    let systemPrompt = `You are a helpful educational content creator specializing in creating ${contentType || 'educational'} content. 
    Your goal is to create high-quality, engaging content based on the user's instructions.`

    if (knowledgeBaseContext) {
      systemPrompt += `\n\nPlease use the following reference materials as context for your response:\n${knowledgeBaseContext}`
    }

    console.log('Calling Anthropic API with system prompt:', systemPrompt)
    console.log('User prompt:', prompt)

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
            content: prompt
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
    
    // Return the generated content
    return new Response(
      JSON.stringify({ 
        content: result.content[0].text,
        model: result.model,
        usage: result.usage
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
