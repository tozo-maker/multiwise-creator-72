import { supabase } from '@/integrations/supabase/client';

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: 'lesson' | 'quiz' | 'activity' | 'assessment' | 'summary' | 'worksheet' | 'presentation' | 'research' | 'guide' | 'case_study';
  promptTemplate: string;
  systemPrompt: string;
  parameters: TemplateParameter[];
  structure: ContentStructure;
  icon?: string;
  category?: string;
  isDefault?: boolean;
  complexity?: 'beginner' | 'intermediate' | 'advanced';
  estimatedLength?: string;
}

export interface TemplateParameter {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'multiselect' | 'tags' | 'rich_text';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  placeholder?: string;
  minValue?: number;
  maxValue?: number;
  group?: string;
}

export interface ContentStructure {
  sections: {
    id: string;
    name: string;
    description?: string;
    required: boolean;
    defaultContent?: string;
    allowCustomization?: boolean;
  }[];
}

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
  },
  {
    id: 'worksheet-interactive',
    name: 'Interactive Worksheet',
    description: 'A comprehensive worksheet with exercises, problems, and answer spaces',
    type: 'worksheet',
    icon: 'pen-line',
    category: 'Practice Materials',
    complexity: 'intermediate',
    estimatedLength: '2-4 pages',
    systemPrompt: 'You are an expert educational content designer who specializes in creating engaging, pedagogically sound worksheets. Focus on clear instructions, adequate space for responses, and scaffolded learning.',
    promptTemplate: 'Create a {difficultyLevel} worksheet on {topic} for {audience} students with {problemCount} problems. Include {includeAnswerKey} and {includeScaffolding}.',
    parameters: [
      {
        id: 'topic',
        name: 'Topic',
        description: 'The subject of the worksheet',
        type: 'text',
        required: true,
        placeholder: 'e.g., Quadratic Equations'
      },
      {
        id: 'difficultyLevel',
        name: 'Difficulty Level',
        description: 'How challenging should the worksheet be',
        type: 'select',
        required: true,
        defaultValue: 'intermediate',
        options: ['beginner', 'intermediate', 'advanced', 'mixed']
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
        id: 'problemCount',
        name: 'Number of Problems',
        description: 'Total problems to include',
        type: 'number',
        required: true,
        defaultValue: 10,
        minValue: 5,
        maxValue: 30
      },
      {
        id: 'includeAnswerKey',
        name: 'Answer Key',
        description: 'Include an answer key',
        type: 'boolean',
        required: true,
        defaultValue: true
      },
      {
        id: 'includeScaffolding',
        name: 'Learning Scaffolding',
        description: 'Include hints and progressive difficulty',
        type: 'boolean',
        required: true,
        defaultValue: true
      }
    ],
    structure: {
      sections: [
        {
          id: 'instructions',
          name: 'Instructions',
          required: true,
          description: 'Clear directions for completing the worksheet'
        },
        {
          id: 'problems',
          name: 'Problems',
          required: true,
          description: 'The worksheet problems with space for answers'
        },
        {
          id: 'answer-key',
          name: 'Answer Key',
          required: false,
          description: 'Solutions to all problems',
          allowCustomization: true
        },
        {
          id: 'additional-resources',
          name: 'Additional Resources',
          required: false,
          description: 'Extra materials or reference information',
          allowCustomization: true
        }
      ]
    }
  },
  {
    id: 'presentation-slides',
    name: 'Educational Presentation',
    description: 'A complete slide presentation with speaker notes and visual suggestions',
    type: 'presentation',
    icon: 'presentation',
    category: 'Instructional Materials',
    complexity: 'intermediate',
    estimatedLength: '10-20 slides',
    systemPrompt: 'You are an expert in creating educational slide presentations that are visually engaging, concise, and effective for teaching concepts. Focus on clear slide content, helpful speaker notes, and logical organization.',
    promptTemplate: 'Create a {slideCount}-slide presentation on {topic} for {audience} students. Include {includeMedia} and organize into {sectionCount} main sections. Each slide should have speaker notes and {visualStyle} style visual suggestions.',
    parameters: [
      {
        id: 'topic',
        name: 'Topic',
        description: 'The subject of the presentation',
        type: 'text',
        required: true,
        placeholder: 'e.g., Introduction to Photosynthesis'
      },
      {
        id: 'audience',
        name: 'Target Audience',
        description: 'The intended audience',
        type: 'select',
        required: true,
        defaultValue: 'high-school',
        options: ['elementary', 'middle-school', 'high-school', 'college', 'adult', 'professional']
      },
      {
        id: 'slideCount',
        name: 'Number of Slides',
        description: 'Total slides to include',
        type: 'number',
        required: true,
        defaultValue: 15,
        minValue: 5,
        maxValue: 30
      },
      {
        id: 'sectionCount',
        name: 'Main Sections',
        description: 'Number of key sections',
        type: 'number',
        required: true,
        defaultValue: 3,
        minValue: 2,
        maxValue: 8
      },
      {
        id: 'includeMedia',
        name: 'Media Suggestions',
        description: 'Type of media to suggest',
        type: 'multiselect',
        required: true,
        defaultValue: ['diagrams', 'images'],
        options: ['diagrams', 'images', 'charts', 'videos', 'interactive elements']
      },
      {
        id: 'visualStyle',
        name: 'Visual Style',
        description: 'Overall aesthetic approach',
        type: 'select',
        required: true,
        defaultValue: 'modern',
        options: ['modern', 'minimalist', 'colorful', 'professional', 'playful']
      }
    ],
    structure: {
      sections: [
        {
          id: 'title',
          name: 'Title Slide',
          required: true,
          description: 'Introduction slide with topic and presenter information'
        },
        {
          id: 'overview',
          name: 'Overview',
          required: true,
          description: 'Agenda and learning objectives'
        },
        {
          id: 'main-content',
          name: 'Main Content Slides',
          required: true,
          description: 'Core presentation content organized by sections'
        },
        {
          id: 'visuals',
          name: 'Visual Suggestions',
          required: true,
          description: 'Guidance on diagrams, images, and other visual elements'
        },
        {
          id: 'activities',
          name: 'Interactive Elements',
          required: false,
          description: 'Engagement activities or discussion prompts',
          allowCustomization: true
        },
        {
          id: 'conclusion',
          name: 'Conclusion',
          required: true,
          description: 'Summary and key takeaways'
        },
        {
          id: 'references',
          name: 'References',
          required: false,
          description: 'Sources and additional resources',
          allowCustomization: true
        }
      ]
    }
  },
  {
    id: 'research-guide',
    name: 'Research Project Guide',
    description: 'A comprehensive guide for conducting academic research projects',
    type: 'research',
    icon: 'microscope',
    category: 'Advanced Learning',
    complexity: 'advanced',
    estimatedLength: '5-10 pages',
    systemPrompt: 'You are an expert academic researcher who specializes in research methodology. Focus on clear, methodical guidance that helps students understand the research process, apply appropriate methods, and document findings properly.',
    promptTemplate: 'Create a research guide on {topic} for {audience} students. The guide should focus on {researchType} research using {methodologyApproach} methodology. Include {includeExamples} and tailor to a {timeframe} project timeline.',
    parameters: [
      {
        id: 'topic',
        name: 'Research Area',
        description: 'The subject area for research',
        type: 'text',
        required: true,
        placeholder: 'e.g., Climate Change Effects on Marine Ecosystems'
      },
      {
        id: 'audience',
        name: 'Academic Level',
        description: 'The intended academic level',
        type: 'select',
        required: true,
        defaultValue: 'undergraduate',
        options: ['high-school', 'undergraduate', 'graduate', 'doctoral']
      },
      {
        id: 'researchType',
        name: 'Research Type',
        description: 'Type of research to conduct',
        type: 'select',
        required: true,
        defaultValue: 'qualitative',
        options: ['qualitative', 'quantitative', 'mixed-methods', 'literature review', 'experimental', 'case study']
      },
      {
        id: 'methodologyApproach',
        name: 'Methodological Approach',
        description: 'Research methodology',
        type: 'select',
        required: true,
        defaultValue: 'standard',
        options: ['standard', 'innovative', 'interdisciplinary', 'comparative', 'longitudinal']
      },
      {
        id: 'includeExamples',
        name: 'Examples & Templates',
        description: 'Elements to include',
        type: 'multiselect',
        required: true,
        defaultValue: ['literature review example', 'methodology template'],
        options: ['literature review example', 'methodology template', 'data collection instruments', 'analysis framework', 'citation examples']
      },
      {
        id: 'timeframe',
        name: 'Project Timeframe',
        description: 'Duration of research project',
        type: 'select',
        required: true,
        defaultValue: 'semester',
        options: ['short (2-4 weeks)', 'semester (3-4 months)', 'academic year', 'multi-year']
      }
    ],
    structure: {
      sections: [
        {
          id: 'overview',
          name: 'Research Overview',
          required: true,
          description: 'Introduction to the research area and significance'
        },
        {
          id: 'literature-review',
          name: 'Literature Review',
          required: true,
          description: 'Guidance on literature review process and examples'
        },
        {
          id: 'methodology',
          name: 'Methodology',
          required: true,
          description: 'Research approach, methods, and tools'
        },
        {
          id: 'data-collection',
          name: 'Data Collection',
          required: true,
          description: 'Processes and instruments for data gathering'
        },
        {
          id: 'analysis',
          name: 'Data Analysis',
          required: true,
          description: 'Approaches to analyzing research data'
        },
        {
          id: 'writing',
          name: 'Research Writing',
          required: true,
          description: 'Guidelines for documenting and presenting findings'
        },
        {
          id: 'timeline',
          name: 'Project Timeline',
          required: true,
          description: 'Schedule and milestones for the research process'
        },
        {
          id: 'resources',
          name: 'Resources & References',
          required: true,
          description: 'Valuable resources and proper citation guidelines'
        }
      ]
    }
  },
  {
    id: 'case-study-analysis',
    name: 'Case Study Analysis',
    description: 'A detailed case study with analysis questions and teaching notes',
    type: 'case_study',
    icon: 'file-search',
    category: 'Applied Learning',
    complexity: 'advanced',
    estimatedLength: '3-8 pages',
    systemPrompt: 'You are an expert educator specializing in case-based teaching and learning. Create realistic, detailed case studies that present complex scenarios requiring critical thinking and application of concepts. Include comprehensive teaching notes that help instructors facilitate productive discussions.',
    promptTemplate: 'Create a {industry} case study focusing on {focusArea} for {audience} students. The case should present {complexityLevel} level challenges and include {analyticalApproach} analytical elements. Include {teachingNotes} for instructors.',
    parameters: [
      {
        id: 'industry',
        name: 'Industry/Field',
        description: 'The field or industry context',
        type: 'text',
        required: true,
        placeholder: 'e.g., Healthcare, Business, Social Work'
      },
      {
        id: 'focusArea',
        name: 'Focus Area',
        description: 'The specific issue or concept',
        type: 'text',
        required: true,
        placeholder: 'e.g., Ethical Decision Making, Process Optimization'
      },
      {
        id: 'audience',
        name: 'Target Audience',
        description: 'The intended academic level',
        type: 'select',
        required: true,
        defaultValue: 'undergraduate',
        options: ['high-school', 'undergraduate', 'graduate', 'professional']
      },
      {
        id: 'complexityLevel',
        name: 'Complexity Level',
        description: 'Level of complexity in the case',
        type: 'select',
        required: true,
        defaultValue: 'intermediate',
        options: ['basic', 'intermediate', 'advanced', 'expert']
      },
      {
        id: 'analyticalApproach',
        name: 'Analysis Framework',
        description: 'Analytical approach for the case',
        type: 'select',
        required: true,
        defaultValue: 'problem-solving',
        options: ['problem-solving', 'decision-making', 'comparative', 'systems thinking', 'ethical analysis', 'stakeholder analysis']
      },
      {
        id: 'teachingNotes',
        name: 'Teaching Notes',
        description: 'Guidance for instructors',
        type: 'multiselect',
        required: true,
        defaultValue: ['discussion questions', 'key takeaways'],
        options: ['discussion questions', 'key takeaways', 'possible solutions', 'background research', 'assessment rubric']
      }
    ],
    structure: {
      sections: [
        {
          id: 'introduction',
          name: 'Introduction',
          required: true,
          description: 'Overview of the case context and key players'
        },
        {
          id: 'background',
          name: 'Background',
          required: true,
          description: 'Detailed context and history relevant to the case'
        },
        {
          id: 'current-situation',
          name: 'Current Situation',
          required: true,
          description: 'The specific challenge or problem to be addressed'
        },
        {
          id: 'key-issues',
          name: 'Key Issues',
          required: true,
          description: 'Analysis of the main challenges or considerations'
        },
        {
          id: 'decision-points',
          name: 'Decision Points',
          required: true,
          description: 'Critical moments requiring decisions or analysis'
        },
        {
          id: 'analysis-questions',
          name: 'Analysis Questions',
          required: true,
          description: 'Questions to guide student analysis'
        },
        {
          id: 'teaching-notes',
          name: 'Teaching Notes',
          required: true,
          description: 'Guidance for instructors using this case'
        },
        {
          id: 'exhibits',
          name: 'Exhibits/Data',
          required: false,
          description: 'Supporting materials, data, or documents',
          allowCustomization: true
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
    return CONTENT_TEMPLATES;
  },

  /**
   * Get templates filtered by content type
   */
  async getTemplatesByType(type: string): Promise<ContentTemplate[]> {
    return CONTENT_TEMPLATES.filter(template => template.type === type);
  },

  /**
   * Get templates filtered by complexity level
   */
  async getTemplatesByComplexity(complexity: string): Promise<ContentTemplate[]> {
    return CONTENT_TEMPLATES.filter(template => template.complexity === complexity);
  },

  /**
   * Get a single template by ID
   */
  async getTemplateById(id: string): Promise<ContentTemplate | undefined> {
    return CONTENT_TEMPLATES.find(template => template.id === id);
  },

  /**
   * Get the default template for a content type
   */
  async getDefaultTemplate(type: string): Promise<ContentTemplate | undefined> {
    return CONTENT_TEMPLATES.find(template => template.type === type && template.isDefault);
  },

  /**
   * Generate an AI prompt from a template with parameter values using advanced prompt engineering
   */
  generatePrompt(template: ContentTemplate, parameterValues: Record<string, any>, knowledgeBaseContext?: string): {
    systemPrompt: string;
    userPrompt: string;
  } {
    let prompt = template.promptTemplate;
    
    // Replace parameters in the template
    for (const param of template.parameters) {
      let value = parameterValues[param.id];
      
      if (param.type === 'multiselect' && Array.isArray(value)) {
        value = value.join(', ');
      } else if (param.type === 'boolean') {
        value = value ? 'yes' : 'no';
      } else if (value === undefined) {
        value = param.defaultValue || '';
      }
      
      prompt = prompt.replace(`{${param.id}}`, value.toString());
    }
    
    // Add structure guidelines with more details
    prompt += '\n\nPlease structure the content with these sections:';
    template.structure.sections.forEach(section => {
      const required = section.required ? '(Required)' : '(Optional)';
      prompt += `\n- ${section.name} ${required}: ${section.description || ''}`;
    });
    
    // Add knowledge base context if available
    if (knowledgeBaseContext && knowledgeBaseContext.trim()) {
      prompt += '\n\nPlease incorporate information from these relevant knowledge base documents:\n';
      prompt += knowledgeBaseContext;
    }
    
    // Add formatting preferences
    prompt += '\n\nFormatting preferences:';
    prompt += '\n- Use Markdown formatting for headings, lists, and emphasis';
    prompt += '\n- Include clear section headings';
    prompt += '\n- Keep content concise and focused';
    
    // Enhanced system prompt with more context
    let systemPrompt = template.systemPrompt || 'You are an expert educational content creator specialized in creating high-quality educational content.';
    
    // Add additional system context based on the template type
    systemPrompt += ` Focus on creating content that is pedagogically sound, engaging, and aligned with best practices in ${template.type} design.`;
    
    return {
      systemPrompt,
      userPrompt: prompt
    };
  },
  
  /**
   * Filter templates by multiple criteria
   */
  async filterTemplates(criteria: {
    type?: string;
    complexity?: string;
    searchTerm?: string;
    category?: string;
  }): Promise<ContentTemplate[]> {
    let filteredTemplates = [...CONTENT_TEMPLATES];
    
    if (criteria.type) {
      filteredTemplates = filteredTemplates.filter(t => t.type === criteria.type);
    }
    
    if (criteria.complexity) {
      filteredTemplates = filteredTemplates.filter(t => t.complexity === criteria.complexity);
    }
    
    if (criteria.category) {
      filteredTemplates = filteredTemplates.filter(t => t.category === criteria.category);
    }
    
    if (criteria.searchTerm) {
      const searchTerm = criteria.searchTerm.toLowerCase();
      filteredTemplates = filteredTemplates.filter(t => 
        t.name.toLowerCase().includes(searchTerm) ||
        t.description.toLowerCase().includes(searchTerm)
      );
    }
    
    return filteredTemplates;
  }
};
