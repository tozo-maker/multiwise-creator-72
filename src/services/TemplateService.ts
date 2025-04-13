
import { supabase } from '@/integrations/supabase/client';

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: 'lesson' | 'quiz' | 'activity' | 'assessment' | 'summary';
  promptTemplate: string;
  parameters: TemplateParameter[];
  structure: ContentStructure;
  icon?: string;
  category?: string;
  isDefault?: boolean;
}

export interface TemplateParameter {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  required: boolean;
  defaultValue?: any;
  options?: string[]; // For select type
  placeholder?: string;
}

export interface ContentStructure {
  sections: {
    id: string;
    name: string;
    description?: string;
    required: boolean;
    defaultContent?: string;
  }[];
}

// Mock data for now - will be moved to database in future
const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'lesson-standard',
    name: 'Standard Lesson',
    description: 'A complete lesson with learning objectives, content sections, and assessment questions',
    type: 'lesson',
    isDefault: true,
    icon: 'book-open',
    category: 'Lessons',
    promptTemplate: 'Create a detailed lesson on {topic} for {audience} students. Include clear learning objectives, {sectionCount} main content sections, examples, and {questionCount} assessment questions.',
    parameters: [
      {
        id: 'topic',
        name: 'Topic',
        description: 'The main subject of the lesson',
        type: 'text',
        required: true,
        placeholder: 'e.g., Photosynthesis'
      },
      {
        id: 'audience',
        name: 'Target Audience',
        description: 'The intended audience for this lesson',
        type: 'select',
        required: true,
        defaultValue: 'high-school',
        options: ['elementary', 'middle-school', 'high-school', 'college', 'adult']
      },
      {
        id: 'sectionCount',
        name: 'Content Sections',
        description: 'Number of main content sections',
        type: 'number',
        required: true,
        defaultValue: 3
      },
      {
        id: 'questionCount',
        name: 'Assessment Questions',
        description: 'Number of questions to include',
        type: 'number',
        required: true,
        defaultValue: 5
      }
    ],
    structure: {
      sections: [
        {
          id: 'objectives',
          name: 'Learning Objectives',
          required: true,
          description: 'What students will learn from this lesson'
        },
        {
          id: 'introduction',
          name: 'Introduction',
          required: true,
          description: 'Overview of the topic'
        },
        {
          id: 'main-content',
          name: 'Main Content',
          required: true,
          description: 'The primary lesson material'
        },
        {
          id: 'examples',
          name: 'Examples',
          required: true,
          description: 'Practical examples illustrating the concepts'
        },
        {
          id: 'assessment',
          name: 'Assessment',
          required: true,
          description: 'Questions to evaluate understanding'
        },
        {
          id: 'conclusion',
          name: 'Conclusion',
          required: false,
          description: 'Summary of key points'
        }
      ]
    }
  },
  {
    id: 'quiz-multiple-choice',
    name: 'Multiple Choice Quiz',
    description: 'A quiz with multiple choice questions and answer key',
    type: 'quiz',
    isDefault: true,
    icon: 'check-square',
    category: 'Assessments',
    promptTemplate: 'Create a {questionCount} question multiple-choice quiz on {topic} for {audience} students. Each question should have {optionCount} options with one correct answer. Include an answer key.',
    parameters: [
      {
        id: 'topic',
        name: 'Topic',
        description: 'The subject of the quiz',
        type: 'text',
        required: true,
        placeholder: 'e.g., Cell Biology'
      },
      {
        id: 'audience',
        name: 'Target Audience',
        description: 'The intended audience for this quiz',
        type: 'select',
        required: true,
        defaultValue: 'high-school',
        options: ['elementary', 'middle-school', 'high-school', 'college', 'adult']
      },
      {
        id: 'questionCount',
        name: 'Number of Questions',
        description: 'Total questions in the quiz',
        type: 'number',
        required: true,
        defaultValue: 10
      },
      {
        id: 'optionCount',
        name: 'Options per Question',
        description: 'Number of possible answers per question',
        type: 'number',
        required: true,
        defaultValue: 4
      }
    ],
    structure: {
      sections: [
        {
          id: 'instructions',
          name: 'Instructions',
          required: true,
          description: 'Directions for taking the quiz'
        },
        {
          id: 'questions',
          name: 'Questions',
          required: true,
          description: 'The quiz questions with options'
        },
        {
          id: 'answer-key',
          name: 'Answer Key',
          required: true,
          description: 'Correct answers for each question'
        }
      ]
    }
  },
  {
    id: 'activity-interactive',
    name: 'Interactive Activity',
    description: 'An engaging activity with student interaction and discussion',
    type: 'activity',
    icon: 'users',
    category: 'Activities',
    promptTemplate: 'Design an interactive {activityType} activity on {topic} for {audience} students that takes {duration} minutes to complete. Include materials needed, step-by-step instructions, and discussion questions.',
    parameters: [
      {
        id: 'topic',
        name: 'Topic',
        description: 'The subject of the activity',
        type: 'text',
        required: true,
        placeholder: 'e.g., Chemical Reactions'
      },
      {
        id: 'activityType',
        name: 'Activity Type',
        description: 'The type of activity',
        type: 'select',
        required: true,
        options: ['group', 'individual', 'pair', 'class'],
        defaultValue: 'group'
      },
      {
        id: 'audience',
        name: 'Target Audience',
        description: 'The intended audience',
        type: 'select',
        required: true,
        defaultValue: 'high-school',
        options: ['elementary', 'middle-school', 'high-school', 'college', 'adult']
      },
      {
        id: 'duration',
        name: 'Duration (minutes)',
        description: 'How long the activity takes',
        type: 'number',
        required: true,
        defaultValue: 30
      }
    ],
    structure: {
      sections: [
        {
          id: 'overview',
          name: 'Overview',
          required: true,
          description: 'Brief summary of the activity'
        },
        {
          id: 'materials',
          name: 'Materials',
          required: true,
          description: 'List of required materials'
        },
        {
          id: 'preparation',
          name: 'Preparation',
          required: true,
          description: 'Steps to prepare for the activity'
        },
        {
          id: 'instructions',
          name: 'Instructions',
          required: true,
          description: 'Step-by-step activity instructions'
        },
        {
          id: 'discussion',
          name: 'Discussion Questions',
          required: true,
          description: 'Questions to discuss during/after the activity'
        },
        {
          id: 'assessment',
          name: 'Assessment',
          required: false,
          description: 'How to evaluate student participation'
        }
      ]
    }
  },
  {
    id: 'assessment-rubric',
    name: 'Assessment Rubric',
    description: 'A comprehensive rubric for evaluating student work',
    type: 'assessment',
    icon: 'clipboard-check',
    category: 'Assessments',
    promptTemplate: 'Create a detailed assessment rubric for {assessmentType} on {topic} for {audience} students. Include {criteriaCount} evaluation criteria with {levelCount} performance levels.',
    parameters: [
      {
        id: 'topic',
        name: 'Topic',
        description: 'The subject being assessed',
        type: 'text',
        required: true,
        placeholder: 'e.g., Research Essay'
      },
      {
        id: 'assessmentType',
        name: 'Assessment Type',
        description: 'The type of assessment',
        type: 'select',
        required: true,
        options: ['essay', 'project', 'presentation', 'lab-report', 'performance'],
        defaultValue: 'essay'
      },
      {
        id: 'audience',
        name: 'Target Audience',
        description: 'The intended audience',
        type: 'select',
        required: true,
        defaultValue: 'high-school',
        options: ['elementary', 'middle-school', 'high-school', 'college', 'adult']
      },
      {
        id: 'criteriaCount',
        name: 'Evaluation Criteria',
        description: 'Number of criteria to assess',
        type: 'number',
        required: true,
        defaultValue: 5
      },
      {
        id: 'levelCount',
        name: 'Performance Levels',
        description: 'Number of performance levels',
        type: 'number',
        required: true,
        defaultValue: 4
      }
    ],
    structure: {
      sections: [
        {
          id: 'overview',
          name: 'Overview',
          required: true,
          description: 'Description of the assessment'
        },
        {
          id: 'criteria',
          name: 'Evaluation Criteria',
          required: true,
          description: 'Detailed criteria for assessment'
        },
        {
          id: 'levels',
          name: 'Performance Levels',
          required: true,
          description: 'Descriptions of each performance level'
        },
        {
          id: 'rubric',
          name: 'Rubric Table',
          required: true,
          description: 'Complete rubric with criteria and levels'
        },
        {
          id: 'usage',
          name: 'Usage Guide',
          required: false,
          description: 'Instructions for applying the rubric'
        }
      ]
    }
  },
  {
    id: 'summary-concept',
    name: 'Concept Summary',
    description: 'A concise summary of key concepts for review',
    type: 'summary',
    icon: 'file-text',
    category: 'Study Materials',
    promptTemplate: 'Create a {length} summary of key concepts on {topic} for {audience} students. Include {conceptCount} main concepts with definitions and examples.',
    parameters: [
      {
        id: 'topic',
        name: 'Topic',
        description: 'The subject to summarize',
        type: 'text',
        required: true,
        placeholder: 'e.g., Plate Tectonics'
      },
      {
        id: 'audience',
        name: 'Target Audience',
        description: 'The intended audience',
        type: 'select',
        required: true,
        defaultValue: 'high-school',
        options: ['elementary', 'middle-school', 'high-school', 'college', 'adult']
      },
      {
        id: 'length',
        name: 'Length',
        description: 'Length of the summary',
        type: 'select',
        required: true,
        options: ['brief', 'moderate', 'comprehensive'],
        defaultValue: 'moderate'
      },
      {
        id: 'conceptCount',
        name: 'Number of Concepts',
        description: 'Key concepts to include',
        type: 'number',
        required: true,
        defaultValue: 5
      }
    ],
    structure: {
      sections: [
        {
          id: 'overview',
          name: 'Overview',
          required: true,
          description: 'Brief introduction to the topic'
        },
        {
          id: 'key-concepts',
          name: 'Key Concepts',
          required: true,
          description: 'Essential concepts with explanations'
        },
        {
          id: 'examples',
          name: 'Examples',
          required: true,
          description: 'Illustrative examples for each concept'
        },
        {
          id: 'relationships',
          name: 'Relationships',
          required: false,
          description: 'How concepts relate to each other'
        },
        {
          id: 'review-questions',
          name: 'Review Questions',
          required: false,
          description: 'Questions for self-assessment'
        }
      ]
    }
  }
];

export const TemplateService = {
  /**
   * Get all available content templates
   */
  async getTemplates(): Promise<ContentTemplate[]> {
    // In the future, this would fetch from the database
    return CONTENT_TEMPLATES;
  },

  /**
   * Get templates filtered by content type
   */
  async getTemplatesByType(type: string): Promise<ContentTemplate[]> {
    // In the future, this would query the database
    return CONTENT_TEMPLATES.filter(template => template.type === type);
  },

  /**
   * Get a single template by ID
   */
  async getTemplateById(id: string): Promise<ContentTemplate | undefined> {
    // In the future, this would query the database
    return CONTENT_TEMPLATES.find(template => template.id === id);
  },

  /**
   * Get the default template for a content type
   */
  async getDefaultTemplate(type: string): Promise<ContentTemplate | undefined> {
    // In the future, this would query the database
    return CONTENT_TEMPLATES.find(template => template.type === type && template.isDefault);
  },

  /**
   * Generate an AI prompt from a template with parameter values
   */
  generatePrompt(template: ContentTemplate, parameterValues: Record<string, any>): string {
    let prompt = template.promptTemplate;
    
    // Replace parameters in the template
    for (const param of template.parameters) {
      const value = parameterValues[param.id] || param.defaultValue || '';
      prompt = prompt.replace(`{${param.id}}`, value.toString());
    }
    
    // Add structure guidelines
    prompt += '\n\nPlease structure the content with these sections:';
    template.structure.sections.forEach(section => {
      prompt += `\n- ${section.name}: ${section.description || ''}`;
    });
    
    return prompt;
  }
};
