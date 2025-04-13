
import { ContentTemplate, TemplateParameter } from './TemplateService';

/**
 * Extend template with conditional logic processing
 */
export const processConditionalTemplate = (
  template: string, 
  params: Record<string, any>,
  conditions: Record<string, boolean> = {}
): string => {
  // Process conditionals in the format {{#if condition}}content{{/if}}
  let processedTemplate = template;
  
  // Match conditional blocks
  const conditionalRegex = /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  
  processedTemplate = processedTemplate.replace(
    conditionalRegex,
    (match, condition, content) => {
      // Check if condition is true
      if (conditions[condition] || params[condition]) {
        return content;
      }
      return ''; // Remove content if condition is false
    }
  );
  
  // Process params in the format {{param}}
  const paramRegex = /\{\{([^}]+)\}\}/g;
  
  processedTemplate = processedTemplate.replace(
    paramRegex,
    (match, paramName) => {
      if (params[paramName] !== undefined) {
        return String(params[paramName]);
      }
      return match; // Keep original if param not found
    }
  );
  
  return processedTemplate;
};

/**
 * Advanced template rendering with sections and blocks
 */
export const renderStructuredTemplate = (
  template: ContentTemplate,
  paramValues: Record<string, any>,
  options: {
    renderSectionTitle?: boolean;
    includeOptionalSections?: boolean;
  } = {}
): string => {
  const { renderSectionTitle = true, includeOptionalSections = true } = options;
  
  // Replace parameters in the system prompt
  let finalSystemPrompt = template.systemPrompt;
  
  // Replace parameters in the prompt template
  let finalPrompt = template.promptTemplate;
  
  // Process parameters
  for (const param of template.parameters) {
    let value = paramValues[param.id];
    
    if (param.type === 'multiselect' && Array.isArray(value)) {
      value = value.join(', ');
    } else if (param.type === 'boolean') {
      value = value ? 'yes' : 'no';
    } else if (value === undefined) {
      value = param.defaultValue || '';
    }
    
    const placeholder = `{${param.id}}`;
    finalPrompt = finalPrompt.replace(new RegExp(placeholder, 'g'), String(value));
    finalSystemPrompt = finalSystemPrompt.replace(new RegExp(placeholder, 'g'), String(value));
  }
  
  // Build structured content with sections
  let structuredContent = '';
  
  // Add system prompt as comment
  structuredContent += `<!-- System: ${finalSystemPrompt} -->\n\n`;
  
  // Add main prompt
  structuredContent += `${finalPrompt}\n\n`;
  
  // Add structured sections
  template.structure.sections.forEach(section => {
    // Skip optional sections if not included
    if (!section.required && !includeOptionalSections) return;
    
    if (renderSectionTitle) {
      structuredContent += `## ${section.name}\n\n`;
    }
    
    if (section.description) {
      structuredContent += `<!-- ${section.description} -->\n\n`;
    }
    
    if (section.defaultContent) {
      structuredContent += `${section.defaultContent}\n\n`;
    } else {
      // Add placeholder for content
      structuredContent += `[Content for ${section.name}]\n\n`;
    }
  });
  
  return structuredContent;
};

/**
 * Template validation
 */
export const validateTemplateParameters = (
  template: ContentTemplate,
  paramValues: Record<string, any>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  for (const param of template.parameters) {
    const value = paramValues[param.id];
    
    // Check required parameters
    if (param.required && (value === undefined || value === null || value === '')) {
      errors[param.id] = `${param.name} is required`;
      continue;
    }
    
    // Skip validation for empty optional parameters
    if (!param.required && (value === undefined || value === null || value === '')) {
      continue;
    }
    
    // Type-specific validation
    switch (param.type) {
      case 'number':
        if (typeof value !== 'number' && typeof value !== 'string') {
          errors[param.id] = `${param.name} must be a number`;
        } else {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            errors[param.id] = `${param.name} must be a valid number`;
          } else if (param.minValue !== undefined && numValue < param.minValue) {
            errors[param.id] = `${param.name} must be at least ${param.minValue}`;
          } else if (param.maxValue !== undefined && numValue > param.maxValue) {
            errors[param.id] = `${param.name} must be at most ${param.maxValue}`;
          }
        }
        break;
        
      case 'select':
        if (param.options && !param.options.includes(value)) {
          errors[param.id] = `${param.name} must be one of: ${param.options.join(', ')}`;
        }
        break;
        
      case 'multiselect':
        if (!Array.isArray(value)) {
          errors[param.id] = `${param.name} must be an array`;
        } else if (param.options && value.some(v => !param.options!.includes(v))) {
          errors[param.id] = `${param.name} contains invalid options`;
        }
        break;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Combine templates to create a new composite template
 */
export const combineTemplates = (
  baseTemplate: ContentTemplate,
  additionalTemplate: ContentTemplate,
  options: {
    overridePrompt?: boolean;
    appendSections?: boolean;
  } = {}
): ContentTemplate => {
  const { overridePrompt = false, appendSections = true } = options;
  
  // Create new template based on base template
  const combinedTemplate: ContentTemplate = {
    ...baseTemplate,
    id: `${baseTemplate.id}-combined-${Date.now()}`,
    name: `${baseTemplate.name} + ${additionalTemplate.name}`,
    description: `Combined template of ${baseTemplate.name} and ${additionalTemplate.name}`,
    // Combine prompts or override
    systemPrompt: overridePrompt ? 
      additionalTemplate.systemPrompt : 
      `${baseTemplate.systemPrompt}\n\n${additionalTemplate.systemPrompt}`,
    promptTemplate: overridePrompt ? 
      additionalTemplate.promptTemplate : 
      `${baseTemplate.promptTemplate}\n\n${additionalTemplate.promptTemplate}`,
    // Combine parameters, avoiding duplicates
    parameters: [
      ...baseTemplate.parameters,
      ...additionalTemplate.parameters.filter(
        p => !baseTemplate.parameters.some(bp => bp.id === p.id)
      )
    ],
    // Combine or append sections
    structure: {
      sections: appendSections ? 
        [...baseTemplate.structure.sections, ...additionalTemplate.structure.sections] :
        [...additionalTemplate.structure.sections]
    }
  };
  
  return combinedTemplate;
};

/**
 * Generate a template variation with different difficulty levels
 */
export const createTemplateVariant = (
  template: ContentTemplate,
  variant: 'simplified' | 'advanced' | 'expert'
): ContentTemplate => {
  // Create a copy of the template with modified settings
  const variantTemplate: ContentTemplate = {
    ...template,
    id: `${template.id}-${variant}`,
    name: `${template.name} (${variant})`,
  };
  
  // Adjust based on variant type
  switch (variant) {
    case 'simplified':
      variantTemplate.complexity = 'beginner';
      // Simplify by removing optional sections
      variantTemplate.structure = {
        sections: template.structure.sections.filter(section => section.required)
      };
      // Adjust system prompt
      variantTemplate.systemPrompt = `${template.systemPrompt}\n\nCreate a simplified version suitable for beginners with clear explanations and minimal complexity.`;
      break;
      
    case 'advanced':
      variantTemplate.complexity = 'advanced';
      // Add more detailed instructions
      variantTemplate.systemPrompt = `${template.systemPrompt}\n\nCreate an advanced version with detailed analysis, nuanced explanations, and comprehensive coverage of the topic.`;
      break;
      
    case 'expert':
      variantTemplate.complexity = 'expert';
      // Add expert-level requirements
      variantTemplate.systemPrompt = `${template.systemPrompt}\n\nCreate an expert-level version with sophisticated analysis, technical depth, and an assumption of prior knowledge in the subject area.`;
      break;
  }
  
  return variantTemplate;
};
