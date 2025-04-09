
export interface Project {
  id: string;
  name: string;
  description?: string;
  type: string;
  targetLanguage: string;
  lastModified: string;
  progress: number;
  status?: 'active' | 'archived' | 'completed';
  deadline?: string;
}

export interface KnowledgeBaseFile {
  id: string;
  name: string;
  description: string;
  fileType: string;
  size: string;
  uploadDate: string;
  url: string;
  category?: string;
}
