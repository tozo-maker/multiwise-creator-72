
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Handles OPTIONS requests for CORS
const handleCorsRequest = () => {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return handleCorsRequest();
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestData = await req.json();
    const { fileId, projectId, userId } = requestData;

    if (!fileId || !projectId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: fileId, projectId, or userId" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`Processing document: fileId=${fileId}, projectId=${projectId}, userId=${userId}`);

    // Fetch the file data from the database
    const { data: fileData, error: fileError } = await supabase
      .from("knowledge_base_files")
      .select("*")
      .eq("id", fileId)
      .single();

    if (fileError || !fileData) {
      console.error("Error fetching file data:", fileError);
      return new Response(
        JSON.stringify({ error: "File not found or error retrieving file data" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    console.log("File data retrieved:", fileData.name);

    // TODO: Implement Anthropic API integration for document analysis
    // For now, generate mock insights
    const mockInsights = {
      title: fileData.name,
      summary: `This is an automatically generated summary for ${fileData.name}`,
      key_concepts: [
        { concept: "Education", relevance: 0.85 },
        { concept: "Learning", relevance: 0.78 },
        { concept: "Knowledge", relevance: 0.72 }
      ],
      sentiment_score: 0.65,
      complexity_level: "Intermediate",
      language_detected: "English"
    };

    // Store insights in the database
    const { data: insightData, error: insightError } = await supabase
      .from("document_insights")
      .insert({
        project_id: projectId,
        user_id: userId,
        file_id: fileId,
        title: mockInsights.title,
        summary: mockInsights.summary,
        key_concepts: mockInsights.key_concepts,
        sentiment_score: mockInsights.sentiment_score,
        complexity_level: mockInsights.complexity_level,
        language_detected: mockInsights.language_detected
      })
      .select()
      .single();

    if (insightError) {
      console.error("Error storing document insights:", insightError);
      return new Response(
        JSON.stringify({ error: "Failed to store document insights" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("Document insights stored successfully:", insightData.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Document processed successfully",
        insights: insightData
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing document:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error processing document" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
