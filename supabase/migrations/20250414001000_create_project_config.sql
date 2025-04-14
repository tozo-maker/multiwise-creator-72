
-- Create project_config table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."project_config" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "project_id" UUID NOT NULL REFERENCES "public"."projects" ("id") ON DELETE CASCADE,
  "name" TEXT,
  "projectType" TEXT,
  "targetLanguage" TEXT,
  "subjects" TEXT[],
  "levels" TEXT[],
  "pedagogy" TEXT,
  "complexity" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_by" UUID REFERENCES "public"."profiles" ("id"),
  "updated_by" UUID REFERENCES "public"."profiles" ("id")
);

-- Add RLS policies
ALTER TABLE "public"."project_config" ENABLE ROW LEVEL SECURITY;

-- Project config RLS
CREATE POLICY "Project config is viewable by project members" 
  ON "public"."project_config"
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id
      AND (
        p.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM project_members pm
          WHERE pm.project_id = p.id
          AND pm.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Project config can be inserted by project members" 
  ON "public"."project_config"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id
      AND (
        p.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM project_members pm
          WHERE pm.project_id = p.id
          AND pm.user_id = auth.uid()
          AND pm.role IN ('owner', 'editor')
        )
      )
    )
  );

CREATE POLICY "Project config can be updated by project members" 
  ON "public"."project_config"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id
      AND (
        p.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM project_members pm
          WHERE pm.project_id = p.id
          AND pm.user_id = auth.uid()
          AND pm.role IN ('owner', 'editor')
        )
      )
    )
  );

-- Create index
CREATE INDEX IF NOT EXISTS project_config_project_id_idx ON public.project_config (project_id);
