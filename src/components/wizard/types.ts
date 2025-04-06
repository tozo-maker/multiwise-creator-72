
// Define the configuration data interface
export interface ConfigData {
  name: string;
  quickStart: string;
  // System Configuration
  interfaceLanguage: string;
  experienceLevel: string;
  interactionMode: string;
  outputDetail: string;
  systemBehavior: string;
  // Project Configuration
  projectType: string;
  customProjectType: string;
  subjects: string[];
  levels: string[];
  pedagogy: string;
  customPedagogy: string;
  wordCount: number;
  wordDistribution: string;
  wordEnforcement: string;
  // Language Configuration
  targetLanguage: string;
  goal: string;
  complexity: string;
  culturalIntegration: string;
  terminology: string;
  markers: string;
  standards: string[];
  customStandards: string[];
  structure: string;
  formatting: string;
  // Documents
  uploadedDocuments: string[];
  needsDocumentUpload: boolean;
  // Metadata
  createdDate: string;
  lastModified: string;
}
