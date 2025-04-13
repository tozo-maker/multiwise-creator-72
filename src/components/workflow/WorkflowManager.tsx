
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Check, Clock, PlusCircle, Activity, Settings, Users, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApprovalService, ApprovalStep, ApprovalWorkflow, ApprovalWorkflowTemplate } from '@/services/ApprovalService';
import { useTheme } from '@/contexts/ThemeContext';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface WorkflowManagerProps {
  contentId: string;
  projectId: string;
}

export const WorkflowManager: React.FC<WorkflowManagerProps> = ({ contentId, projectId }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('current');
  const [templates, setTemplates] = useState<ApprovalWorkflowTemplate[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<ApprovalStep[]>([]);
  
  const [isAddingWorkflow, setIsAddingWorkflow] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [newTemplateSteps, setNewTemplateSteps] = useState<string[]>(['']);

  // For deadline management
  const [date, setDate] = useState<Date>();
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [deadlineSetting, setDeadlineSetting] = useState(false);
  
  // Fetch workflow templates
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
  
  // Fetch current workflow for the content
  useEffect(() => {
    const loadCurrentWorkflow = async () => {
      try {
        // This would normally fetch from the database
        // For now, we'll use a sample workflow
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
  
  // Add a workflow for the content
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
      const workflow = await ApprovalService.createWorkflow(contentId, selectedTemplateId);
      setCurrentWorkflow(workflow);
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
  
  // Update workflow step status
  const updateStepStatus = async (stepId: string, status: 'pending' | 'completed' | 'rejected', comments?: string) => {
    try {
      await ApprovalService.updateWorkflowStep(contentId, stepId, { status, comments });
      
      // Update local state
      setCurrentWorkflow(currentWorkflow.map(step => 
        step.id === stepId ? { ...step, status, comments } : step
      ));
      
      toast({
        title: 'Step Updated',
        description: `Step status has been changed to ${status}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Could not update workflow step',
        variant: 'destructive'
      });
    }
  };
  
  // Create a new workflow template
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
    
    // In a real app, this would save to the database
    const newTemplate: ApprovalWorkflowTemplate = {
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
    
    // Reset form
    setNewTemplateName('');
    setNewTemplateDescription('');
    setNewTemplateSteps(['']);
    
    toast({
      title: 'Template Created',
      description: 'Your custom workflow template has been created',
    });
  };
  
  // Add a new step input to the custom template form
  const addTemplateStep = () => {
    setNewTemplateSteps([...newTemplateSteps, '']);
  };
  
  // Update step name in the custom template form
  const updateTemplateStep = (index: number, value: string) => {
    const updatedSteps = [...newTemplateSteps];
    updatedSteps[index] = value;
    setNewTemplateSteps(updatedSteps);
  };
  
  // Remove step from the custom template form
  const removeTemplateStep = (index: number) => {
    if (newTemplateSteps.length <= 1) return;
    const updatedSteps = newTemplateSteps.filter((_, i) => i !== index);
    setNewTemplateSteps(updatedSteps);
  };
  
  // Set deadline for a workflow step
  const setStepDeadline = () => {
    if (!selectedStepId || !date) return;
    
    // In a real app, this would update the database
    // For now, we'll just update the local state
    setCurrentWorkflow(currentWorkflow.map(step => 
      step.id === selectedStepId ? { 
        ...step, 
        metadata: { 
          ...(step.metadata || {}), 
          deadline: date.toISOString() 
        } 
      } : step
    ));
    
    setDeadlineSetting(false);
    setSelectedStepId(null);
    
    toast({
      title: 'Deadline Set',
      description: `Step deadline has been set to ${format(date, 'PPP')}`,
    });
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };
  
  // Get status badge icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-3.5 w-3.5" />;
      case 'rejected':
        return <Users className="h-3.5 w-3.5" />;
      default:
        return <Clock className="h-3.5 w-3.5" />;
    }
  };
  
  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle>Workflow Management</CardTitle>
        <CardDescription>Manage approval processes and deadlines</CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 m-4">
            <TabsTrigger value="current" className="flex items-center gap-1">
              <Activity size={15} />
              <span>Current Workflow</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1">
              <Settings size={15} />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="deadlines" className="flex items-center gap-1">
              <Calendar size={15} />
              <span>Deadlines</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="p-4 pt-0">
            {currentWorkflow.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Current Approval Process</h3>
                
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
                          <Badge variant="outline" className={`${getStatusColor(step.status)} ml-2`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(step.status)}
                              <span className="capitalize">{step.status}</span>
                            </span>
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {step.description}
                        </p>
                        
                        {step.comments && (
                          <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-sm">
                            <span className="font-medium">Comments:</span> {step.comments}
                          </div>
                        )}
                      </div>
                      
                      {step.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => updateStepStatus(step.id, 'completed', 'Approved without comments')}
                          >
                            Approve
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                Reject
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Step</DialogTitle>
                                <DialogDescription>
                                  Provide feedback on why this step is being rejected
                                </DialogDescription>
                              </DialogHeader>
                              <Textarea 
                                id="rejection-feedback"
                                placeholder="Enter rejection reason here..."
                                className="mt-2"
                              />
                              <DialogFooter>
                                <Button 
                                  variant="destructive"
                                  onClick={() => {
                                    const feedback = (document.getElementById('rejection-feedback') as HTMLTextAreaElement).value;
                                    updateStepStatus(step.id, 'rejected', feedback);
                                  }}
                                >
                                  Confirm Rejection
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
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
            
            {/* Add Workflow Dialog */}
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
            
            {/* Create Template Dialog */}
            <Dialog open={isCreatingTemplate} onOpenChange={setIsCreatingTemplate}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Workflow Template</DialogTitle>
                  <DialogDescription>
                    Define a custom approval workflow template
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Template Name</label>
                    <Input
                      placeholder="E.g., Three-Step Approval"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Describe the purpose of this workflow template"
                      value={newTemplateDescription}
                      onChange={(e) => setNewTemplateDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Steps</label>
                    <div className="space-y-2">
                      {newTemplateSteps.map((step, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Step ${index + 1} name`}
                            value={step}
                            onChange={(e) => updateTemplateStep(index, e.target.value)}
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => removeTemplateStep(index)}
                            className="flex-shrink-0"
                          >
                            <span className="sr-only">Remove</span>
                            <X size={15} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addTemplateStep}
                      className="mt-2 w-full"
                    >
                      <PlusCircle size={15} className="mr-1" />
                      Add Step
                    </Button>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button onClick={handleCreateTemplate}>
                    Create Template
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="templates" className="p-4 pt-0">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Available Workflow Templates</h3>
              
              <div className="grid gap-3">
                {templates.map(template => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="mt-2">
                        {template.steps.map((step, index) => (
                          <div 
                            key={`${template.id}-${step.id}`} 
                            className={`py-2 ${index < template.steps.length - 1 ? 'border-b' : ''}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-medium">
                                {index + 1}
                              </span>
                              <span className="font-medium text-sm">{step.name}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 ml-7">
                              {step.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 flex justify-end">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedTemplateId(template.id);
                          setIsAddingWorkflow(true);
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-center mt-4">
                <Button onClick={() => setIsCreatingTemplate(true)} className="gap-1">
                  <PlusCircle size={15} />
                  Create Custom Template
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="deadlines" className="p-4 pt-0">
            {currentWorkflow.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Workflow Deadlines</h3>
                
                {currentWorkflow.map((step) => (
                  <div 
                    key={`deadline-${step.id}`} 
                    className="flex justify-between items-center p-3 rounded-md border bg-white dark:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-700">
                        <CalendarIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">{step.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {step.metadata?.deadline 
                            ? `Due: ${format(new Date(step.metadata.deadline), 'PPP')}` 
                            : 'No deadline set'}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedStepId(step.id);
                        setDeadlineSetting(true);
                        if (step.metadata?.deadline) {
                          setDate(new Date(step.metadata.deadline));
                        }
                      }}
                    >
                      {step.metadata?.deadline ? 'Change Deadline' : 'Set Deadline'}
                    </Button>
                  </div>
                ))}
                
                {/* Deadline Setting Dialog */}
                <Dialog open={deadlineSetting} onOpenChange={setDeadlineSetting}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Set Deadline</DialogTitle>
                      <DialogDescription>
                        Choose a deadline for this workflow step
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex justify-center py-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-[280px] justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <DialogFooter>
                      <Button onClick={setStepDeadline} disabled={!date}>
                        Set Deadline
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
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
        </Tabs>
      </CardContent>
    </Card>
  );
};
