
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Activity, CalendarIcon, Settings, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { ApprovalService, ApprovalStep } from '@/services/ApprovalService';
import { WorkflowService } from '@/services/WorkflowService';
import { DeadlineManager } from './DeadlineManager';
import { WorkflowAssignment } from './WorkflowAssignment';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, X } from 'lucide-react';

interface EnhancedWorkflowManagerProps {
  contentId: string;
  projectId: string;
}

export const EnhancedWorkflowManager: React.FC<EnhancedWorkflowManagerProps> = ({ 
  contentId, 
  projectId 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('current');
  const [templates, setTemplates] = useState<any[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<ApprovalStep[]>([]);
  
  const [isAddingWorkflow, setIsAddingWorkflow] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [newTemplateSteps, setNewTemplateSteps] = useState<string[]>(['']);
  
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templatesData = await ApprovalService.getWorkflowTemplates();
        setTemplates(templatesData);
        if (templatesData.length > 0) {
          setSelectedTemplateId(templatesData[0].id);
        }
      } catch (error) {
        console.error('Error loading workflow templates:', error);
      }
    };
    
    loadTemplates();
  }, []);
  
  useEffect(() => {
    const loadCurrentWorkflow = async () => {
      try {
        if (contentId) {
          const workflow = await ApprovalService.createWorkflow(contentId);
          setCurrentWorkflow(workflow);
        }
      } catch (error) {
        console.error('Error loading current workflow:', error);
      }
    };
    
    if (contentId) {
      loadCurrentWorkflow();
    }
  }, [contentId]);
  
  const handleAddWorkflow = async () => {
    if (!selectedTemplateId) {
      toast({
        title: 'Selection Required',
        description: 'Please select a workflow template',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const workflow = await WorkflowService.createEnhancedWorkflow(contentId, selectedTemplateId);
      
      if (workflow) {
        setCurrentWorkflow(workflow.steps);
      }
      
      setIsAddingWorkflow(false);
      
      toast({
        title: 'Workflow Created',
        description: 'Approval workflow has been added to this content',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Could not create workflow',
        variant: 'destructive'
      });
    }
  };
  
  const handleDeadlinesUpdated = () => {
    // Refresh workflow data
    loadCurrentWorkflow();
  };
  
  const handleAssignmentsUpdated = () => {
    // Refresh workflow data
    loadCurrentWorkflow();
  };
  
  const loadCurrentWorkflow = async () => {
    try {
      if (contentId) {
        const workflow = await WorkflowService.getWorkflowByContent(contentId);
        if (workflow) {
          setCurrentWorkflow(workflow.steps);
        }
      }
    } catch (error) {
      console.error('Error refreshing workflow:', error);
    }
  };

  const handleCreateTemplate = () => {
    if (!newTemplateName) {
      toast({
        title: 'Name Required',
        description: 'Please provide a name for the template',
        variant: 'destructive'
      });
      return;
    }
    
    if (newTemplateSteps.some(step => !step.trim())) {
      toast({
        title: 'Invalid Steps',
        description: 'Please provide a name for each step',
        variant: 'destructive'
      });
      return;
    }
    
    const newTemplate: any = {
      id: `custom-${Date.now()}`,
      name: newTemplateName,
      description: newTemplateDescription,
      steps: newTemplateSteps.map((name, index) => ({
        id: `step-${Date.now()}-${index}`,
        name,
        description: `Custom step: ${name}`,
        order: index
      }))
    };
    
    setTemplates([...templates, newTemplate]);
    setSelectedTemplateId(newTemplate.id);
    setIsCreatingTemplate(false);
    
    setNewTemplateName('');
    setNewTemplateDescription('');
    setNewTemplateSteps(['']);
    
    toast({
      title: 'Template Created',
      description: 'Your custom workflow template has been created',
    });
  };
  
  const addTemplateStep = () => {
    setNewTemplateSteps([...newTemplateSteps, '']);
  };
  
  const updateTemplateStep = (index: number, value: string) => {
    const updatedSteps = [...newTemplateSteps];
    updatedSteps[index] = value;
    setNewTemplateSteps(updatedSteps);
  };
  
  const removeTemplateStep = (index: number) => {
    if (newTemplateSteps.length <= 1) return;
    const updatedSteps = newTemplateSteps.filter((_, i) => i !== index);
    setNewTemplateSteps(updatedSteps);
  };
  
  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle>Enhanced Workflow Management</CardTitle>
        <CardDescription>Manage approval processes, deadlines, and assignments</CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 m-4">
            <TabsTrigger value="current" className="flex items-center gap-1">
              <Activity size={15} />
              <span>Current Workflow</span>
            </TabsTrigger>
            <TabsTrigger value="deadlines" className="flex items-center gap-1">
              <CalendarIcon size={15} />
              <span>Deadlines</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-1">
              <Users size={15} />
              <span>Assignments</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="p-4 pt-0">
            {currentWorkflow.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Current Approval Process</h3>
                
                {/* Render the current workflow steps */}
                {currentWorkflow.map((step, index) => (
                  <div 
                    key={step.id} 
                    className={`p-3 rounded-md border ${isDark ? 'border-slate-700' : 'border-slate-200'} ${
                      step.status === 'completed' 
                        ? 'bg-green-50 dark:bg-green-900/20' 
                        : step.status === 'rejected'
                        ? 'bg-red-50 dark:bg-red-900/20'
                        : 'bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-medium">
                            {index + 1}
                          </span>
                          <h4 className="font-medium">{step.name}</h4>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {step.description}
                        </p>
                        
                        {/* Display deadline if set */}
                        {step.metadata?.deadline && (
                          <div className="mt-2 flex items-center gap-1">
                            <CalendarIcon className="h-3.5 w-3.5 text-slate-500" />
                            <span className="text-xs text-slate-500">
                              Due: {new Date(step.metadata.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity size={40} className="mx-auto mb-2 text-slate-400" />
                <h3 className="text-lg font-medium mb-1">No Active Workflow</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Add an approval workflow to manage the review process
                </p>
                <Button onClick={() => setIsAddingWorkflow(true)}>
                  Add Workflow
                </Button>
              </div>
            )}
            
            {/* Dialog for adding workflow */}
            <Dialog open={isAddingWorkflow} onOpenChange={setIsAddingWorkflow}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Approval Workflow</DialogTitle>
                  <DialogDescription>
                    Select a workflow template to apply to this content
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Template</label>
                    <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select workflow template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedTemplateId && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Template Preview</h4>
                        <div className="border rounded-md p-2 bg-slate-50 dark:bg-slate-800">
                          {templates.find(t => t.id === selectedTemplateId)?.steps.map((step, index) => (
                            <div key={step.id} className="py-1.5 border-b last:border-0">
                              <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-medium">
                                  {index + 1}
                                </span>
                                <span>{step.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsCreatingTemplate(true)}>
                    Create Custom Template
                  </Button>
                  <Button onClick={handleAddWorkflow}>
                    Add Workflow
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="deadlines" className="p-4 pt-0">
            {currentWorkflow.length > 0 ? (
              <DeadlineManager 
                contentId={contentId}
                steps={currentWorkflow}
                onDeadlinesUpdated={handleDeadlinesUpdated}
              />
            ) : (
              <div className="text-center py-8">
                <CalendarIcon size={40} className="mx-auto mb-2 text-slate-400" />
                <h3 className="text-lg font-medium mb-1">No Workflow Added</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Add a workflow to manage deadlines
                </p>
                <Button onClick={() => setActiveTab('current')}>
                  Go to Workflow
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="assignments" className="p-4 pt-0">
            {currentWorkflow.length > 0 ? (
              <WorkflowAssignment 
                contentId={contentId}
                steps={currentWorkflow}
                onAssignmentsUpdated={handleAssignmentsUpdated}
              />
            ) : (
              <div className="text-center py-8">
                <Users size={40} className="mx-auto mb-2 text-slate-400" />
                <h3 className="text-lg font-medium mb-1">No Workflow Added</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Add a workflow to manage assignments
                </p>
                <Button onClick={() => setActiveTab('current')}>
                  Go to Workflow
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
