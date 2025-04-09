
import { Database } from '@/integrations/supabase/types';

// Define custom types that extend or use the Supabase generated types
export type Project = {
  id: string;
  name: string;
  description: string;
  type: string;
  targetLanguage: string;
  lastModified: string;
  progress: number;
  status?: 'active' | 'archived' | 'completed';
};

export type KnowledgeBaseFile = {
  id: string;
  name: string;
  description: string;
  fileType: string;
  size: string;
  uploadDate: string;
  url?: string;
  category?: string;
};

// Add more custom types as needed
export type UserProfile = {
  id: string;
  username: string;
  avatarUrl?: string;
  role: 'admin' | 'editor' | 'viewer';
};

// You can still reference the database types when needed
export type DbUser = Database['public']['Tables']['users']['Row'];
