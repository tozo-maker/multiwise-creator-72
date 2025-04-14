
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/ui/DialogFooter';
import { Badge } from '@/components/ui/badge';
import { Check, Plus, Users, CalendarDays, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DeadlineManager } from './DeadlineManager';
import { WorkflowAssignment } from './WorkflowAssignment';
import { WorkflowService } from '@/services/WorkflowService';

interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  assignedTo?: string;
  dueDate?: Date;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
  stepId: string;
}

interface EnhancedWorkflowManagerProps {
  contentId: string;
  projectId: string;
}

export const EnhancedWorkflowManager: React.FC<EnhancedWorkflowManagerProps> = ({
  contentId,
  projectId
}) => {
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: 'step1',
      name: 'Initial Review',
      description: 'Review content for basic quality and compliance',
      status: 'pending'
    },
    {
      id: 'step2',
      name: 'Subject Matter Expert Review',
      description: 'Verify accuracy of content by subject matter experts',
      status: 'pending'
    },
    {
      id: 'step3',
      name: 'Editorial Review',
      description: 'Check grammar, style, and formatting',
      status: 'pending'
    },
    {
      id: 'step4',
      name: 'Final Approval',
      description: 'Final approval by project manager',
      status: 'pending'
    }
  ]);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStep, setNewStep] = useState({ name: '', description: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const handleStepStatusChange = async (stepId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'rejected') => {
    setIsUpdating(true);
    try {
      // A real implementation would call an API to update the status
      setSteps(prev => 
        prev.map(step => 
          step.id === stepId ? { ...step, status: newStatus } : step
        )
      );
      
      if (newStatus === 'completed') {
        await WorkflowService.completeStep(contentId, stepId);
      } else if (newStatus === 'rejected') {
        await WorkflowService.rejectStep(contentId, stepId);
      }
      
      toast({
        title: "Status updated",
        description: `Workflow step status updated to ${newStatus.replace('_', ' ')}`
      });
    } catch (error) {
      console.error('Error updating step status:', error);
      toast({
        title: "Error updating status",
        description: "There was an error updating the workflow status",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeadlineChange = (stepId: string, date: Date | null) => {
    setSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, dueDate: date || undefined } : step
      )
    );
  };
  
  const handleAssignmentChange = (stepId: string, userId: string) => {
    setSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, assignedTo: userId } : step
      )
    );
  };
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: 'current-user-id', // In a real app, this would be the actual user ID
      userName: 'Current User', // In a real app, this would be the actual user name
      text: newComment,
      createdAt: new Date(),
      stepId: 'all' // Comments can be general or specific to a step
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment('');
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the workflow"
    });
  };
  
  const handleAddStep = () => {
    if (!newStep.name.trim()) {
      toast({
        title: "Validation error",
        description: "Step name is required",
        variant: "destructive"
      });
      return;
    }
    
    const step: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: newStep.name,
      description: newStep.description,
      status: 'pending'
    };
    
    setSteps(prev => [...prev, step]);
    setNewStep({ name: '', description: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Step added",
      description: "New workflow step has been added"
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in_progress':
        return 'bg-blue-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Content Workflow</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex gap-1 items-center">
              <Plus className="h-4 w-4" />
              <span>Add Step</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Workflow Step</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="stepName">Step Name</Label>
                <Input
                  id="stepName"
                  value={newStep.name}
                  onChange={(e) => setNewStep(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter step name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stepDescription">Description</Label>
                <Textarea
                  id="stepDescription"
                  value={newStep.description}
                  onChange={(e) => setNewStep(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter step description (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddStep}>Add Step</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="steps">
          <TabsList>
            <TabsTrigger value="steps" className="flex gap-2 items-center">
              <Check className="h-4 w-4" />
              <span>Steps</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex gap-2 items-center">
              <Users className="h-4 w-4" />
              <span>Assignments</span>
            </TabsTrigger>
            <TabsTrigger value="deadlines" className="flex gap-2 items-center">
              <CalendarDays className="h-4 w-4" />
              <span>Deadlines</span>
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex gap-2 items-center">
              <MessageSquare className="h-4 w-4" />
              <span>Comments</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="steps" className="space-y-4 mt-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="p-4 border rounded-md shadow-sm bg-card"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{index + 1}. {step.name}</h3>
                    {step.description && (
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    )}
                  </div>
                  <Badge className={getStatusColor(step.status)}>
                    {step.status.charAt(0).toUpperCase() + step.status.slice(1).replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  {step.status !== 'completed' && step.status !== 'in_progress' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStepStatusChange(step.id, 'in_progress')}
                      disabled={isUpdating}
                    >
                      Start
                    </Button>
                  )}
                  {step.status !== 'completed' && step.status === 'in_progress' && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => handleStepStatusChange(step.id, 'completed')}
                      disabled={isUpdating}
                    >
                      Complete
                    </Button>
                  )}
                  {step.status !== 'rejected' && step.status === 'in_progress' && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleStepStatusChange(step.id, 'rejected')}
                      disabled={isUpdating}
                    >
                      Reject
                    </Button>
                  )}
                  {(step.status === 'completed' || step.status === 'rejected') && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStepStatusChange(step.id, 'pending')}
                      disabled={isUpdating}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="assignments" className="mt-4">
            <WorkflowAssignment 
              contentId={contentId}
              steps={steps.map(step => ({ 
                id: step.id,
                name: step.name,
                status: step.status as 'pending' | 'completed' | 'rejected'
              }))}
              onAssignmentsUpdated={() => {
                toast({
                  title: "Assignments updated",
                  description: "Workflow assignments have been updated"
                });
              }}
            />
          </TabsContent>
          
          <TabsContent value="deadlines" className="space-y-4 mt-4">
            {steps.map((step) => (
              <div
                key={`deadline-${step.id}`}
                className="p-4 border rounded-md shadow-sm"
              >
                <p className="mb-2 font-medium">{step.name}</p>
                <DeadlineManager 
                  contentId={contentId}
                  currentDeadline={step.dueDate}
                  onDeadlineChange={(date) => handleDeadlineChange(step.id, date)}
                />
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="comments" className="mt-4">
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="flex gap-2 items-center">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment about the workflow..."
                    className="resize-none"
                  />
                </div>
                <div className="mt-2 flex justify-end">
                  <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                    Add Comment
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No comments yet</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="border rounded-md p-3 bg-muted/20">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium">{comment.userName}</p>
                        <span className="text-xs text-muted-foreground">
                          {comment.createdAt.toLocaleDateString()} {comment.createdAt.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
