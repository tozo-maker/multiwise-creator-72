
export interface ConfigData {
  // Project Info
  name: string;
  quickStart: string;
  
  // System Config
  interfaceLanguage: string;
  experienceLevel: string;
  interactionMode: string;
  outputDetail: string;
  systemBehavior: string;
  
  // Project Config
  projectType: string;
  customProjectType?: string;
  subjects: string[];
  levels: string[];
  pedagogy: string;
  customPedagogy?: string;
  wordCount: number;
  wordDistribution?: string;
  wordEnforcement?: string;
  
  // Language Config
  targetLanguage: string;
  goal: string;
  complexity: string;
  culturalIntegration: string;
  terminology: string;
  markers: string;
  standards: string[];
  customStandards?: string[];
  structure: string;
  formatting: string;
  scriptType?: string;
  
  // Documents
  uploadedDocuments: { 
    name: string; 
    description: string;
    category?: string; 
    url?: string;
  }[];
  needsDocumentUpload: boolean;
  
  // Project meta
  createdDate?: string;
  lastModified?: string;
}
