
-- Create table for content versions
CREATE TABLE IF NOT EXISTS public.content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  version INT NOT NULL,
  content TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  changes TEXT
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS content_versions_content_id_idx ON public.content_versions (content_id);
CREATE INDEX IF NOT EXISTS content_versions_version_idx ON public.content_versions (version);

-- Create RLS policies for content versions
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

-- Users can view versions of content they can access
CREATE POLICY "Users can view content versions" ON public.content_versions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM content_items 
      WHERE content_items.id = content_versions.content_id 
      AND content_items.project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
      )
    )
  );

-- Users can insert versions for content they own
CREATE POLICY "Users can add content versions" ON public.content_versions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM content_items 
      WHERE content_items.id = content_versions.content_id 
      AND content_items.project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
      )
    )
  );

-- Add a trigger to automatically create a version when content is created
CREATE OR REPLACE FUNCTION public.create_initial_content_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.content_versions (
    content_id, 
    version, 
    content, 
    title, 
    type, 
    metadata, 
    changes
  )
  VALUES (
    NEW.id,
    1,
    NEW.content,
    NEW.title,
    NEW.content_type,
    NEW.metadata,
    'Initial version'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_content_created
AFTER INSERT ON public.content_items
FOR EACH ROW
EXECUTE FUNCTION public.create_initial_content_version();
