
import React from 'react';
import { ApprovalStep } from '@/services/ApprovalService';
import { ApprovalWorkflow } from '@/components/content/ApprovalWorkflow';
import { EnhancedWorkflowManager } from '@/components/workflow/EnhancedWorkflowManager';

interface ContentWorkflowPanelProps {
  contentId: string;
  projectId: string;
  currentStatus: 'draft' | 'published' | 'archived' | 'in-review';
  approvalSteps: ApprovalStep[];
  onStatusChange: (newStatus: 'draft' | 'published' | 'archived' | 'in-review') => void;
  onApprovalUpdate: (steps: ApprovalStep[]) => void;
  isEditable: boolean;
  useEnhanced?: boolean;
}

export const ContentWorkflowPanel: React.FC<ContentWorkflowPanelProps> = ({
  contentId,
  projectId,
  currentStatus,
  approvalSteps,
  onStatusChange,
  onApprovalUpdate,
  isEditable,
  useEnhanced = false
}) => {
  return useEnhanced ? (
    <EnhancedWorkflowManager
      contentId={contentId}
      projectId={projectId}
    />
  ) : (
    <ApprovalWorkflow
      contentId={contentId}
      currentStatus={currentStatus}
      approvalSteps={approvalSteps}
      onStatusChange={onStatusChange}
      onApprovalUpdate={onApprovalUpdate}
      isEditable={isEditable}
    />
  );
};
