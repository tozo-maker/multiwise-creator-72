
-- Create project_outlines table
CREATE TABLE IF NOT EXISTS "public"."project_outlines" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "project_id" UUID NOT NULL REFERENCES "public"."projects" ("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_by" UUID REFERENCES "public"."profiles" ("id"),
  "updated_by" UUID REFERENCES "public"."profiles" ("id")
);

-- Create outline_sections table
CREATE TABLE IF NOT EXISTS "public"."outline_sections" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "outline_id" UUID NOT NULL REFERENCES "public"."project_outlines" ("id") ON DELETE CASCADE,
  "project_id" UUID NOT NULL REFERENCES "public"."projects" ("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create outline_items table
CREATE TABLE IF NOT EXISTS "public"."outline_items" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "outline_id" UUID NOT NULL REFERENCES "public"."project_outlines" ("id") ON DELETE CASCADE,
  "section_id" UUID NOT NULL REFERENCES "public"."outline_sections" ("id") ON DELETE CASCADE,
  "project_id" UUID NOT NULL REFERENCES "public"."projects" ("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "parent_id" UUID REFERENCES "public"."outline_items" ("id") ON DELETE SET NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "content_id" UUID REFERENCES "public"."content_items" ("id") ON DELETE SET NULL,
  "status" TEXT NOT NULL DEFAULT 'not_started',
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create outline_versions table
CREATE TABLE IF NOT EXISTS "public"."outline_versions" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "outline_id" UUID NOT NULL REFERENCES "public"."project_outlines" ("id") ON DELETE CASCADE,
  "version" INTEGER NOT NULL,
  "data" JSONB NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_by" UUID REFERENCES "public"."profiles" ("id"),
  "notes" TEXT
);

-- Add RLS policies
ALTER TABLE "public"."project_outlines" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."outline_sections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."outline_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."outline_versions" ENABLE ROW LEVEL SECURITY;

-- Project outlines RLS
CREATE POLICY "Project outlines are viewable by project members" 
  ON "public"."project_outlines"
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

CREATE POLICY "Project outlines can be inserted by project members" 
  ON "public"."project_outlines"
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

CREATE POLICY "Project outlines can be updated by project members" 
  ON "public"."project_outlines"
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

CREATE POLICY "Project outlines can be deleted by project members" 
  ON "public"."project_outlines"
  FOR DELETE
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

-- Outline sections RLS
CREATE POLICY "Outline sections are viewable by project members" 
  ON "public"."outline_sections"
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

CREATE POLICY "Outline sections can be inserted by project members" 
  ON "public"."outline_sections"
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

CREATE POLICY "Outline sections can be updated by project members" 
  ON "public"."outline_sections"
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

CREATE POLICY "Outline sections can be deleted by project members" 
  ON "public"."outline_sections"
  FOR DELETE
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

-- Outline items RLS
CREATE POLICY "Outline items are viewable by project members" 
  ON "public"."outline_items"
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

CREATE POLICY "Outline items can be inserted by project members" 
  ON "public"."outline_items"
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

CREATE POLICY "Outline items can be updated by project members" 
  ON "public"."outline_items"
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

CREATE POLICY "Outline items can be deleted by project members" 
  ON "public"."outline_items"
  FOR DELETE
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

-- Outline versions RLS
CREATE POLICY "Outline versions are viewable by project members" 
  ON "public"."outline_versions"
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM project_outlines po
      JOIN projects p ON p.id = po.project_id
      WHERE po.id = outline_id
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

CREATE POLICY "Outline versions can be inserted by project members" 
  ON "public"."outline_versions"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_outlines po
      JOIN projects p ON p.id = po.project_id
      WHERE po.id = outline_id
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

-- Create indexes
CREATE INDEX IF NOT EXISTS project_outlines_project_id_idx ON public.project_outlines (project_id);
CREATE INDEX IF NOT EXISTS outline_sections_outline_id_idx ON public.outline_sections (outline_id);
CREATE INDEX IF NOT EXISTS outline_sections_project_id_idx ON public.outline_sections (project_id);
CREATE INDEX IF NOT EXISTS outline_items_outline_id_idx ON public.outline_items (outline_id);
CREATE INDEX IF NOT EXISTS outline_items_section_id_idx ON public.outline_items (section_id);
CREATE INDEX IF NOT EXISTS outline_items_project_id_idx ON public.outline_items (project_id);
CREATE INDEX IF NOT EXISTS outline_items_content_id_idx ON public.outline_items (content_id);
CREATE INDEX IF NOT EXISTS outline_versions_outline_id_idx ON public.outline_versions (outline_id);
