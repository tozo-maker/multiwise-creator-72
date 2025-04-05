
export interface ConfigData {
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
  subjects: string[];
  levels: string[];
  pedagogy: string;
  wordCount: number;
  // Language Config
  targetLanguage: string;
  goal: string;
  complexity: string;
  culturalIntegration: string;
  terminology: string;
  markers: string;
  standards: string;
  structure: string;
  formatting: string;
  // Documents
  uploadedDocuments: { name: string; description: string; }[];
  needsDocumentUpload: boolean;
}
