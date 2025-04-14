
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
  owner?: string;
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

export interface ContentQualityAssessment {
  id: string;
  content_id: string;
  overall_score: number;
  readability_score: number;
  engagement_score: number;
  clarity_score: number;
  accuracy_score: number;
  improvements?: string[];
  strengths?: string[];
  created_at: string;
}

export interface ContentAnalysis {
  id: string;
  content_id: string;
  readability_score: number;
  quality_score: number;
  clarity_score: number;
  engagement_score: number;
  accuracy_score: number;
  suggestions: string[];
  improvements?: string[];
  created_at: string;
}

export interface ReadabilityMetrics {
  fleschKincaidScore: number;
  fleschKincaidGradeLevel: number;
  complexWordCount: number;
  averageSentenceLength: number;
  averageWordLength: number;
  paragraphStructure: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface AccessibilityMetrics {
  overallRating: number;
  screenReaderFriendliness: number;
  semanticStructure: number;
  keyboardNavigability: number;
  colorContrastCompliance: boolean;
  mediaAlternatives: boolean;
  improvementAreas?: string[];
}

export interface ContentQualityMetrics {
  overallScore: number;
  readabilityScore: number;
  engagementScore: number;
  alignmentScore: number;
  accessibilityScore: number;
  strengths: string[];
  improvements?: string[];
}

export interface ContentImprovementSuggestion {
  title: string;
  description: string;
  type: 'clarity' | 'engagement' | 'structure' | 'accessibility' | 'readability';
  priority: 'high' | 'medium' | 'low';
  section?: string;
  originalText?: string;
  suggestedText?: string;
}

export interface LearningObjectiveAlignment {
  objectiveId: string;
  objectiveText: string;
  alignmentScore: number;
  gapAnalysis: string;
  improvementSuggestions: string[];
}
