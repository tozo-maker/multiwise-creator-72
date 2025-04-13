
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ApprovalStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'completed' | 'rejected';
  order: number;
  completedBy?: string;
  completedAt?: Date;
  comments?: string;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  contentId: string;
  steps: ApprovalStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalWorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: Omit<ApprovalStep, 'status' | 'completedBy' | 'completedAt' | 'comments'>[];
  isDefault?: boolean;
}

// Default workflow templates
const DEFAULT_WORKFLOW_TEMPLATES: ApprovalWorkflowTemplate[] = [
  {
    id: 'simple-approval',
    name: 'Simple Approval',
    description: 'Basic one-step approval process',
    isDefault: true,
    steps: [
      {
        id: 'content-review',
        name: 'Content Review',
        description: 'Review content for accuracy and completeness',
        order: 0
      }
    ]
  },
  {
    id: 'two-step-approval',
    name: 'Two-Step Approval',
    description: 'Two-step approval process with editorial and final review',
    steps: [
      {
        id: 'editorial-review',
        name: 'Editorial Review',
        description: 'Review for style, grammar, and formatting',
        order: 0
      },
      {
        id: 'content-approval',
        name: 'Content Approval',
        description: 'Final approval of content accuracy and quality',
        order: 1
      }
    ]
  },
  {
    id: 'academic-review',
    name: 'Academic Review Process',
    description: 'Comprehensive academic review process',
    steps: [
      {
        id: 'peer-review',
        name: 'Peer Review',
        description: 'Initial review by subject matter experts',
        order: 0
      },
      {
        id: 'editorial-review',
        name: 'Editorial Review',
        description: 'Review for clarity, style, and formatting',
        order: 1
      },
      {
        id: 'final-approval',
        name: 'Final Approval',
        description: 'Final approval by department head or administrator',
        order: 2
      }
    ]
  }
];

export const ApprovalService = {
  /**
   * Get all approval workflow templates
   */
  async getWorkflowTemplates(): Promise<ApprovalWorkflowTemplate[]> {
    return DEFAULT_WORKFLOW_TEMPLATES;
  },
  
  /**
   * Get a specific workflow template by ID
   */
  async getWorkflowTemplateById(id: string): Promise<ApprovalWorkflowTemplate | undefined> {
    return DEFAULT_WORKFLOW_TEMPLATES.find(template => template.id === id);
  },
  
  /**
   * Get the default workflow template
   */
  async getDefaultWorkflowTemplate(): Promise<ApprovalWorkflowTemplate> {
    const defaultTemplate = DEFAULT_WORKFLOW_TEMPLATES.find(template => template.isDefault);
    return defaultTemplate || DEFAULT_WORKFLOW_TEMPLATES[0];
  },
  
  /**
   * Create a new approval workflow for content
   */
  async createWorkflow(contentId: string, templateId?: string): Promise<ApprovalStep[]> {
    try {
      // Get template (default if not specified)
      const template = templateId 
        ? await this.getWorkflowTemplateById(templateId)
        : await this.getDefaultWorkflowTemplate();
      
      if (!template) {
        throw new Error('Workflow template not found');
      }
      
      // Create workflow steps with initial status
      const steps: ApprovalStep[] = template.steps.map(step => ({
        ...step,
        status: 'pending'
      }));
      
      // In a real implementation, we would save this to the database
      // For now, we'll just return the steps
      
      return steps;
    } catch (error: any) {
      console.error('Error creating workflow:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create approval workflow',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  /**
   * Update an approval workflow step
   */
  async updateWorkflowStep(
    contentId: string,
    stepId: string,
    update: {
      status?: 'pending' | 'completed' | 'rejected';
      comments?: string;
    }
  ): Promise<void> {
    try {
      // In a real implementation, we would update the database
      // For now, just console log the update
      console.log(`Updating step ${stepId} for content ${contentId}:`, update);
    } catch (error: any) {
      console.error('Error updating workflow step:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update approval step',
        variant: 'destructive',
      });
      throw error;
    }
  }
};
