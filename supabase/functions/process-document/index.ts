
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

// Extract text content from different file types
const extractTextFromFile = async (url: string, fileType: string): Promise<string> => {
  console.log(`Extracting text from ${fileType} file: ${url}`);
  
  // In a production environment, you would implement actual text extraction
  // based on file type, possibly using libraries or services like Tika, PDF.js, etc.
  
  // For now, we'll simulate text extraction
  return `This is simulated text extracted from a ${fileType} file at ${url}`;
};

// Analyze text using NLP techniques
const analyzeText = (text: string): any => {
  // In a production environment, you would:
  // 1. Use Anthropic API or another NLP service to analyze the text
  // 2. Extract key concepts, sentiment, complexity, etc.
  
  // Generate mock insights for now
  const keyWords = ['education', 'learning', 'knowledge', 'curriculum'];
  const randomScore = () => parseFloat((0.5 + Math.random() * 0.5).toFixed(2));
  
  return {
    summary: `This document discusses educational concepts and methodologies. ${text.substring(0, 100)}...`,
    key_concepts: keyWords.map(concept => ({ concept, relevance: randomScore() })),
    sentiment_score: randomScore(),
    complexity_level: ["Basic", "Intermediate", "Advanced"][Math.floor(Math.random() * 3)],
    language_detected: "English"
  };
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

    // Extract text from file (in a real implementation, this would use the file's URL)
    const extractedText = await extractTextFromFile(fileData.url, fileData.file_type);
    
    // Analyze the extracted text
    const analysis = analyzeText(extractedText);

    // Store insights in the database
    const { data: insightData, error: insightError } = await supabase
      .from("document_insights")
      .insert({
        project_id: projectId,
        user_id: userId,
        file_id: fileId,
        title: fileData.name,
        summary: analysis.summary,
        key_concepts: analysis.key_concepts,
        sentiment_score: analysis.sentiment_score,
        complexity_level: analysis.complexity_level,
        language_detected: analysis.language_detected
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
