
export interface OutlineItem {
  id: string;
  title: string;
  description?: string;
  parentId?: string;
  order: number;
  projectId: string;
  contentId?: string; // Link to associated content
  status: 'not_started' | 'in_progress' | 'completed';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface OutlineSection {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  order: number;
  items: OutlineItem[];
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface ProjectOutline {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  sections: OutlineSection[];
  version: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface OutlineVersion {
  id: string;
  outlineId: string;
  version: number;
  data: ProjectOutline;
  createdAt: string;
  createdBy?: string;
  notes?: string;
}
