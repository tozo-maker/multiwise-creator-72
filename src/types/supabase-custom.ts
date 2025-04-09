
// Define custom types that extend or use the Supabase generated types
export type Project = {
  id: string;
  name: string;
  description?: string; // Make description optional
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

// Remove the reference to Database['public']['Tables']['users'] since it doesn't exist
// and create a simplified DbUser type
export type DbUser = {
  id: string;
  email?: string;
  created_at?: string;
};
