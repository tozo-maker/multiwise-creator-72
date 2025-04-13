
-- This file documents the database schema and RLS policies for better visibility

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  target_language TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  progress INTEGER NOT NULL DEFAULT 0,
  user_id UUID NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Projects RLS Policies
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Content Items Table
CREATE TABLE IF NOT EXISTS public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  content_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on content_items
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

-- Content Items RLS Policies
CREATE POLICY "Users can view their own content items" ON public.content_items
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own content items" ON public.content_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own content items" ON public.content_items
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own content items" ON public.content_items
  FOR DELETE USING (auth.uid() = user_id);

-- Knowledge Base Files Table
CREATE TABLE IF NOT EXISTS public.knowledge_base_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL,
  project_id TEXT NOT NULL,
  file_type TEXT NOT NULL,
  size TEXT,
  url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on knowledge_base_files
ALTER TABLE public.knowledge_base_files ENABLE ROW LEVEL SECURITY;

-- Knowledge Base Files RLS Policies
CREATE POLICY "Users can view their own knowledge base files" ON public.knowledge_base_files
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own knowledge base files" ON public.knowledge_base_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own knowledge base files" ON public.knowledge_base_files
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own knowledge base files" ON public.knowledge_base_files
  FOR DELETE USING (auth.uid() = user_id);

-- Document Insights Table
CREATE TABLE IF NOT EXISTS public.document_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL,
  user_id UUID NOT NULL,
  project_id UUID NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  key_concepts JSONB,
  sentiment_score DOUBLE PRECISION,
  complexity_level TEXT,
  language_detected TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on document_insights
ALTER TABLE public.document_insights ENABLE ROW LEVEL SECURITY;

-- Document Insights RLS Policies
CREATE POLICY "Users can view their own document insights" ON public.document_insights
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own document insights" ON public.document_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own document insights" ON public.document_insights
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own document insights" ON public.document_insights
  FOR DELETE USING (auth.uid() = user_id);

-- Analysis Results Table
CREATE TABLE IF NOT EXISTS public.analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  user_id UUID NOT NULL,
  analysis_type TEXT NOT NULL,
  results JSONB NOT NULL,
  metadata JSONB,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on analysis_results
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- Analysis Results RLS Policies
CREATE POLICY "Users can view their own analysis results" ON public.analysis_results
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own analysis results" ON public.analysis_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own analysis results" ON public.analysis_results
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own analysis results" ON public.analysis_results
  FOR DELETE USING (auth.uid() = user_id);
