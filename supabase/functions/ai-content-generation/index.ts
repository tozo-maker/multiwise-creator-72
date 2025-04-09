
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    
    // Check for required API key
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Server misconfiguration: Anthropic API key is missing",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Parse request body
    const { prompt, contentType, language, audience, complexity } = await req.json();

    // Validate required parameters
    if (!prompt || !contentType) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Build system message
    const systemMessage = `You are an expert educational content creator specializing in ${contentType}.
Your task is to create high-quality educational content in ${language || "English"} 
that is appropriate for ${audience || "general"} audience with ${complexity || "intermediate"} complexity level.
Format the content appropriately for ${contentType}.`;

    // Call Anthropic API
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1500,
        temperature: 0.7,
        system: systemMessage,
        messages: [
          { role: "user", content: prompt }
        ]
      }),
    });

    if (!anthropicResponse.ok) {
      const error = await anthropicResponse.json();
      throw new Error(JSON.stringify(error));
    }

    const data = await anthropicResponse.json();
    
    // Extract content from Anthropic response
    const generatedContent = data.content[0].text;

    return new Response(
      JSON.stringify({ content: generatedContent }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in AI content generation:", error);
    
    return new Response(
      JSON.stringify({
        error: "Error generating content",
        details: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
