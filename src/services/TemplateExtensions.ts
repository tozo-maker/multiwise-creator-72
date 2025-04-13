
import { ContentTemplate, TemplateParameter, ContentStructure } from './TemplateService';

/**
 * Interface for more advanced template parameters
 */
export interface EnhancedTemplateParameter extends TemplateParameter {
  // Advanced parameter options
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customValidator?: (value: any) => boolean | string;
  };
  dependsOn?: string; // ID of another parameter this depends on
  showIf?: (values: Record<string, any>) => boolean; // Conditional display
  transform?: (value: any) => any; // Transform value before use
  helpText?: string; // Additional help text
  examples?: string[]; // Example values
}

/**
 * Interface for template variations
 */
export interface TemplateVariation {
  id: string;
  name: string;
  description?: string;
  parameterOverrides?: Record<string, any>;
  systemPromptSuffix?: string;
  promptTemplateSuffix?: string;
  additionalSections?: ContentStructure['sections'];
}

/**
 * Additional educational template types
 */
export const educationalTemplateTypes = [
  'lecture_notes',
  'syllabus',
  'student_guide',
  'lab_exercise',
  'educational_game',
  'interactive_tutorial',
  'concept_map',
  'annotated_bibliography',
  'discussion_guide',
  'differentiated_instruction',
  'assessment_rubric',
  'learning_path',
  'unit_plan'
] as const;

export type EducationalTemplateType = typeof educationalTemplateTypes[number];

/**
 * Create advanced educational template
 */
export const createEducationalTemplate = (
  baseInfo: {
    id: string;
    name: string;
    description: string;
    type: EducationalTemplateType;
    icon?: string;
  },
  templateOptions: {
    systemPrompt: string;
    promptTemplate: string;
    parameters: (TemplateParameter | EnhancedTemplateParameter)[];
    sections: ContentStructure['sections'];
    variations?: TemplateVariation[];
  }
): ContentTemplate => {
  return {
    ...baseInfo,
    complexity: 'intermediate', // default
    systemPrompt: templateOptions.systemPrompt,
    promptTemplate: templateOptions.promptTemplate,
    parameters: templateOptions.parameters,
    structure: {
      sections: templateOptions.sections
    },
    // Store variations as metadata
    metadata: {
      variations: templateOptions.variations || []
    }
  } as ContentTemplate;
};

/**
 * Create a template from a sample document
 */
export const createTemplateFromSample = (
  sampleContent: string,
  type: string,
  name: string,
  description: string
): ContentTemplate => {
  // Extract sections from the sample content (assuming markdown format)
  const sectionRegex = /^##\s+(.+)$/gm;
  const matches = [...sampleContent.matchAll(sectionRegex)];
  
  const sections: ContentStructure['sections'] = matches.map((match, index) => {
    const sectionName = match[1].trim();
    return {
      id: sectionName.toLowerCase().replace(/\s+/g, '-'),
      name: sectionName,
      required: index < 3, // First 3 sections are required
      description: `Content for ${sectionName}`
    };
  });
  
  // If no sections found, create a default one
  if (sections.length === 0) {
    sections.push({
      id: 'content',
      name: 'Content',
      required: true,
      description: 'Main content'
    });
  }
  
  // Extract potential parameters from content with pattern {paramName}
  const paramRegex = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
  const paramMatches = [...sampleContent.matchAll(paramRegex)];
  const uniqueParams = [...new Set(paramMatches.map(match => match[1]))];
  
  const parameters: TemplateParameter[] = uniqueParams.map(paramName => ({
    id: paramName,
    name: paramName.charAt(0).toUpperCase() + paramName.slice(1).replace(/_/g, ' '),
    description: `Value for ${paramName}`,
    type: 'text',
    required: true
  }));
  
  return {
    id: `template-${Date.now()}`,
    name,
    description,
    type,
    systemPrompt: "Create content following the structure and style of this template.",
    promptTemplate: sampleContent,
    parameters,
    structure: { sections }
  };
};

/**
 * Additional pre-built educational templates
 */
export const additionalEducationalTemplates: ContentTemplate[] = [
  // Differentiated Instruction Plan
  createEducationalTemplate(
    {
      id: 'differentiated-instruction',
      name: 'Differentiated Instruction Plan',
      description: 'A comprehensive plan for addressing diverse learning needs',
      type: 'differentiated_instruction',
      icon: 'users'
    },
    {
      systemPrompt: "You are an expert in differentiated instruction and inclusive teaching practices. Create a thorough plan that addresses multiple learning styles, abilities, and needs.",
      promptTemplate: "Create a differentiated instruction plan for teaching {topic} to {gradeLevel} students. Include strategies for {learningStyles} learning styles and accommodate {accommodations}.",
      parameters: [
        {
          id: 'topic',
          name: 'Topic',
          description: 'The subject matter to be taught',
          type: 'text',
          required: true
        },
        {
          id: 'gradeLevel',
          name: 'Grade Level',
          description: 'Target grade level',
          type: 'select',
          options: ['elementary', 'middle-school', 'high-school', 'college'],
          required: true,
          defaultValue: 'middle-school'
        },
        {
          id: 'learningStyles',
          name: 'Learning Styles',
          description: 'Learning styles to accommodate',
          type: 'multiselect',
          options: ['visual', 'auditory', 'kinesthetic', 'reading/writing'],
          required: true,
          defaultValue: ['visual', 'auditory', 'kinesthetic']
        },
        {
          id: 'accommodations',
          name: 'Accommodations',
          description: 'Special accommodations to include',
          type: 'multiselect',
          options: ['ADHD', 'dyslexia', 'ELL/ESL', 'gifted', 'hearing impaired', 'visually impaired'],
          required: true,
          defaultValue: ['ADHD', 'ELL/ESL']
        }
      ],
      sections: [
        {
          id: 'overview',
          name: 'Overview',
          required: true,
          description: 'Summary of the differentiated instruction approach'
        },
        {
          id: 'learning-objectives',
          name: 'Learning Objectives',
          required: true,
          description: 'Clear objectives for all student groups'
        },
        {
          id: 'content-differentiation',
          name: 'Content Differentiation',
          required: true,
          description: 'How content will be adapted for different learners'
        },
        {
          id: 'process-differentiation',
          name: 'Process Differentiation',
          required: true,
          description: 'How teaching methods will be adapted'
        },
        {
          id: 'product-differentiation',
          name: 'Product Differentiation',
          required: true,
          description: 'How student outputs and assessments will be adapted'
        },
        {
          id: 'learning-environment',
          name: 'Learning Environment',
          required: true,
          description: 'Classroom setup and environmental considerations'
        },
        {
          id: 'assessment-strategies',
          name: 'Assessment Strategies',
          required: true,
          description: 'How to assess diverse learners fairly'
        },
        {
          id: 'resources',
          name: 'Resources',
          required: false,
          description: 'Materials needed for implementation'
        }
      ],
      variations: [
        {
          id: 'inclusion-focused',
          name: 'Inclusion-Focused Variation',
          description: 'Emphasizes full inclusion practices',
          systemPromptSuffix: 'Focus on full inclusion strategies that maintain all students in the same learning environment while differentiating effectively.'
        },
        {
          id: 'multilingual',
          name: 'Multilingual Learners Focus',
          description: 'Specialized for language learners',
          systemPromptSuffix: 'Emphasize strategies specifically designed for multilingual learners while maintaining content rigor.'
        }
      ]
    }
  ),
  
  // Unit Plan
  createEducationalTemplate(
    {
      id: 'unit-plan',
      name: 'Comprehensive Unit Plan',
      description: 'A detailed multi-week unit plan with lessons and assessments',
      type: 'unit_plan',
      icon: 'calendar'
    },
    {
      systemPrompt: "You are an expert curriculum designer with experience in backward design and standards alignment. Create a comprehensive unit plan that is cohesive, engaging, and effectively addresses learning standards.",
      promptTemplate: "Create a {duration}-week unit plan on {topic} for {gradeLevel} students. Align with {standards} standards and include {lessonCount} lessons.",
      parameters: [
        {
          id: 'topic',
          name: 'Unit Topic',
          description: 'The subject of the unit',
          type: 'text',
          required: true
        },
        {
          id: 'duration',
          name: 'Duration (weeks)',
          description: 'Length of the unit in weeks',
          type: 'number',
          required: true,
          defaultValue: 3,
          minValue: 1,
          maxValue: 9
        },
        {
          id: 'gradeLevel',
          name: 'Grade Level',
          description: 'Target grade level',
          type: 'select',
          options: ['elementary', 'middle-school', 'high-school', 'college'],
          required: true,
          defaultValue: 'high-school'
        },
        {
          id: 'standards',
          name: 'Educational Standards',
          description: 'Standards framework to align with',
          type: 'select',
          options: ['CCSS', 'NGSS', 'State-Specific', 'National', 'International'],
          required: true,
          defaultValue: 'CCSS'
        },
        {
          id: 'lessonCount',
          name: 'Number of Lessons',
          description: 'Total lessons in the unit',
          type: 'number',
          required: true,
          defaultValue: 10,
          minValue: 5,
          maxValue: 30
        }
      ],
      sections: [
        {
          id: 'unit-overview',
          name: 'Unit Overview',
          required: true,
          description: 'Introduction and rationale for the unit'
        },
        {
          id: 'essential-questions',
          name: 'Essential Questions',
          required: true,
          description: 'Guiding questions for the unit'
        },
        {
          id: 'learning-objectives',
          name: 'Learning Objectives',
          required: true,
          description: 'Specific outcomes for students'
        },
        {
          id: 'standards-alignment',
          name: 'Standards Alignment',
          required: true,
          description: 'How unit aligns with educational standards'
        },
        {
          id: 'unit-calendar',
          name: 'Unit Calendar',
          required: true,
          description: 'Day-by-day or week-by-week schedule'
        },
        {
          id: 'lesson-outlines',
          name: 'Lesson Outlines',
          required: true,
          description: 'Brief descriptions of each lesson'
        },
        {
          id: 'assessment-plan',
          name: 'Assessment Plan',
          required: true,
          description: 'Formative and summative assessments'
        },
        {
          id: 'materials-resources',
          name: 'Materials and Resources',
          required: true,
          description: 'Resources needed for the unit'
        },
        {
          id: 'differentiation',
          name: 'Differentiation Strategies',
          required: true,
          description: 'How to adapt for different learners'
        },
        {
          id: 'extension-activities',
          name: 'Extension Activities',
          required: false,
          description: 'Additional activities for advanced learners'
        },
        {
          id: 'interdisciplinary-connections',
          name: 'Interdisciplinary Connections',
          required: false,
          description: 'Links to other subject areas'
        }
      ],
      variations: [
        {
          id: 'project-based',
          name: 'Project-Based Learning',
          description: 'Focuses on a culminating project',
          systemPromptSuffix: 'Structure this unit around a central driving question and culminating project that demonstrates mastery of the content.'
        },
        {
          id: 'inquiry-based',
          name: 'Inquiry-Based Approach',
          description: 'Emphasizes student investigation',
          systemPromptSuffix: 'Design this unit using an inquiry-based approach where students develop and investigate their own questions about the content.'
        }
      ]
    }
  )
];

// Additional functions could be added here for more advanced template operations
