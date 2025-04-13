
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Clock, CheckCircle, AlertCircle, RotateCcw, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ContentService } from '@/services/ContentService';

export interface ApprovalStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'completed' | 'rejected';
  completedBy?: string;
  completedAt?: Date;
  comments?: string;
}

interface ApprovalWorkflowProps {
  contentId: string;
  currentStatus: 'draft' | 'published' | 'archived' | 'in-review';
  approvalSteps: ApprovalStep[];
  onStatusChange: (newStatus: 'draft' | 'published' | 'archived' | 'in-review') => void;
  onApprovalUpdate: (steps: ApprovalStep[]) => void;
  isEditable: boolean;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  contentId,
  currentStatus,
  approvalSteps,
  onStatusChange,
  onApprovalUpdate,
  isEditable
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmitForReview = async () => {
    try {
      // Update content status to in-review
      await ContentService.update(contentId, {
        status: 'in-review'
      });
      
      // Mark first step as pending
      const updatedSteps = [...approvalSteps];
      if (updatedSteps.length > 0) {
        updatedSteps[0].status = 'pending';
      }
      
      onStatusChange('in-review');
      onApprovalUpdate(updatedSteps);
      
      toast({
        title: 'Sent for Review',
        description: 'Content has been submitted for review',
      });
    } catch (error: any) {
      console.error('Error submitting for review:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit for review',
        variant: 'destructive',
      });
    }
  };

  const handleApproveStep = async (stepIndex: number) => {
    try {
      const updatedSteps = [...approvalSteps];
      updatedSteps[stepIndex].status = 'completed';
      updatedSteps[stepIndex].completedAt = new Date();
      updatedSteps[stepIndex].completedBy = 'Current User'; // This would be dynamic in a real app
      
      // If this was the last step, update status to published
      if (stepIndex === updatedSteps.length - 1) {
        await ContentService.update(contentId, {
          status: 'published'
        });
        onStatusChange('published');
      } else {
        // Set the next step to pending
        updatedSteps[stepIndex + 1].status = 'pending';
      }
      
      onApprovalUpdate(updatedSteps);
      
      toast({
        title: 'Step Approved',
        description: `Approved: ${updatedSteps[stepIndex].name}`,
      });
    } catch (error: any) {
      console.error('Error approving step:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve step',
        variant: 'destructive',
      });
    }
  };

  const handleRejectStep = async (stepIndex: number) => {
    try {
      const updatedSteps = [...approvalSteps];
      updatedSteps[stepIndex].status = 'rejected';
      updatedSteps[stepIndex].completedAt = new Date();
      
      // Update status back to draft
      await ContentService.update(contentId, {
        status: 'draft'
      });
      
      onStatusChange('draft');
      onApprovalUpdate(updatedSteps);
      
      toast({
        title: 'Review Rejected',
        description: `Changes requested for: ${updatedSteps[stepIndex].name}`,
      });
    } catch (error: any) {
      console.error('Error rejecting step:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject step',
        variant: 'destructive',
      });
    }
  };

  const getStepStatusBadge = (status: string) => {
    if (isDark) {
      switch (status) {
        case 'pending':
          return <Badge className="bg-yellow-900/30 text-yellow-300">Pending</Badge>;
        case 'completed':
          return <Badge className="bg-green-900/30 text-green-300">Approved</Badge>;
        case 'rejected':
          return <Badge className="bg-red-900/30 text-red-300">Rejected</Badge>;
        default:
          return <Badge className="bg-slate-800 text-slate-300">Not Started</Badge>;
      }
    } else {
      switch (status) {
        case 'pending':
          return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
        case 'completed':
          return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
        case 'rejected':
          return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
        default:
          return <Badge className="bg-slate-100 text-slate-800">Not Started</Badge>;
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Card className={isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}>
      <CardHeader>
        <CardTitle className={`text-lg flex items-center justify-between ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <div>Approval Workflow</div>
          {currentStatus === 'draft' && isEditable && (
            <Button 
              onClick={handleSubmitForReview} 
              size="sm"
              className="bg-brand-600 hover:bg-brand-700"
            >
              Submit for Review
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {approvalSteps.map((step, index) => (
            <div 
              key={step.id}
              className={`p-4 rounded-md border ${
                isDark 
                  ? 'border-slate-700 bg-slate-800/50' 
                  : 'border-slate-200 bg-white'
              } ${
                step.status === 'pending' 
                  ? (isDark ? 'ring-1 ring-yellow-500/30' : 'ring-1 ring-yellow-500/30') 
                  : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getStatusIcon(step.status)}
                  </div>
                  <div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {step.name}
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {step.description}
                    </p>
                    {step.completedAt && (
                      <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {step.completedBy || 'User'} • {new Date(step.completedAt).toLocaleDateString()}
                      </p>
                    )}
                    {step.comments && (
                      <p className={`text-sm mt-2 italic ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        "{step.comments}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStepStatusBadge(step.status)}
                  
                  {step.status === 'pending' && isEditable && (
                    <div className="flex space-x-1 ml-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleApproveStep(index)}
                        className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-100/20"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleRejectStep(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100/20"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {approvalSteps.length === 0 && (
            <div className={`p-6 text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              No approval steps defined for this content.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
