export interface EnhancedProjectData {
  // Basic information
  name: string;
  description: string;
  
  // Quick Start
  quickStart: string;
  templateId: string;
  
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
  scriptType: string;
  
  // Knowledge Base
  hasKnowledgeBase?: boolean;
  knowledgeBaseFiles?: string[];
  
  // Other settings
  deadline?: string;
  
  // Adding the missing properties to match ProjectData
  type: string;
  language: string;
  targetAudience: string;
}

export interface SystemConfigOption {
  value: string;
  label: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ProjectFormat {
  value: string;
  label: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Subject {
  value: string;
  label: string;
  category?: string;
}

export interface EducationLevel {
  value: string;
  label: string;
  ageRange?: string;
  description?: string;
}

export interface PedagogyApproach {
  value: string;
  label: string;
  description: string;
}

export interface LanguageGoal {
  value: string;
  label: string;
  description: string;
}

export interface CulturalIntegrationLevel {
  value: string;
  label: string;
  description: string;
}
