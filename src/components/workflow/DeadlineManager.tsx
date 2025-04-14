import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock, AlertTriangle } from 'lucide-react';
import { WorkflowService } from '@/services/WorkflowService';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface DeadlineManagerProps {
  contentId: string;
  steps: {
    id: string;
    name: string;
    status: 'pending' | 'completed' | 'rejected';
    metadata?: {
      deadline?: string;
      [key: string]: any;
    };
  }[];
  onDeadlinesUpdated?: () => void;
}

export const DeadlineManager: React.FC<DeadlineManagerProps> = ({
  contentId,
  steps,
  onDeadlinesUpdated
}) => {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isSettingDeadline, setIsSettingDeadline] = useState(false);
  const { toast } = useToast();

  const handleOpenCalendar = (stepId: string, existingDeadline?: string) => {
    setSelectedStepId(stepId);
    
    if (existingDeadline) {
      setSelectedDate(new Date(existingDeadline));
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow);
    }
    
    setIsSettingDeadline(true);
  };

  const handleSetDeadline = async () => {
    if (!selectedStepId || !selectedDate) return;
    
    try {
      await WorkflowService.setStepDeadlines(contentId, [
        { stepId: selectedStepId, deadline: selectedDate }
      ]);
      
      toast({
        title: 'Deadline Set',
        description: `Deadline set for ${format(selectedDate, 'PPP')}`,
      });
      
      if (onDeadlinesUpdated) {
        onDeadlinesUpdated();
      }
    } catch (error) {
      console.error('Error setting deadline:', error);
      toast({
        title: 'Error',
        description: 'Failed to set deadline',
        variant: 'destructive'
      });
    } finally {
      setIsSettingDeadline(false);
      setSelectedStepId(null);
    }
  };

  const isStepOverdue = (step: any) => {
    if (!step.metadata?.deadline) return false;
    
    const deadlineDate = new Date(step.metadata.deadline);
    return deadlineDate < new Date() && step.status === 'pending';
  };

  const getDeadlineStatus = (step: any) => {
    if (!step.metadata?.deadline) return null;
    
    const deadlineDate = new Date(step.metadata.deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0 && step.status === 'pending') {
      return { type: 'overdue', days: Math.abs(diffDays) };
    } else if (diffDays <= 2 && step.status === 'pending') {
      return { type: 'soon', days: diffDays };
    }
    
    return { type: 'normal', days: diffDays };
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Manage Deadlines</h3>
      
      {steps.map(step => {
        const deadlineStatus = getDeadlineStatus(step);
        
        return (
          <div 
            key={step.id} 
            className={`p-3 rounded-md border flex items-center justify-between ${
              isStepOverdue(step) ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 
              'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-slate-500" />
              <div>
                <div className="font-medium">{step.name}</div>
                {step.metadata?.deadline ? (
                  <div className="text-xs text-slate-500">
                    Due: {format(new Date(step.metadata.deadline), 'PPP')}
                    {deadlineStatus?.type === 'overdue' && (
                      <Badge variant="destructive" className="ml-2">
                        {deadlineStatus.days} {deadlineStatus.days === 1 ? 'day' : 'days'} overdue
                      </Badge>
                    )}
                    {deadlineStatus?.type === 'soon' && (
                      <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                        Due {deadlineStatus.days === 0 ? 'today' : `in ${deadlineStatus.days} ${deadlineStatus.days === 1 ? 'day' : 'days'}`}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">No deadline set</div>
                )}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleOpenCalendar(step.id, step.metadata?.deadline)}
            >
              {step.metadata?.deadline ? 'Change Deadline' : 'Set Deadline'}
            </Button>
          </div>
        );
      })}
      
      <Popover open={isSettingDeadline} onOpenChange={setIsSettingDeadline}>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3 border-b">
            <h4 className="font-medium">Set Deadline</h4>
            <p className="text-xs text-slate-500">Select date for step completion</p>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            initialFocus
            disabled={(date) => date < new Date()}
          />
          <div className="flex justify-end p-3 border-t">
            <Button 
              size="sm" 
              onClick={handleSetDeadline}
              disabled={!selectedDate}
            >
              Set Deadline
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
