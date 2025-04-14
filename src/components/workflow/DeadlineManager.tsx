
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, isAfter, isBefore, differenceInDays, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface DeadlineManagerProps {
  projectId?: string;
  contentId?: string;
  currentDeadline?: Date | null;
  onDeadlineChange?: (date: Date | null) => void;
  className?: string;
}

export const DeadlineManager: React.FC<DeadlineManagerProps> = ({
  projectId,
  contentId,
  currentDeadline,
  onDeadlineChange,
  className
}) => {
  const [date, setDate] = useState<Date | null>(currentDeadline || null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (currentDeadline) {
      setDate(currentDeadline);
    }
  }, [currentDeadline]);
  
  const handleDateSelect = (selectedDate: Date | null) => {
    setDate(selectedDate);
    
    if (selectedDate && isBefore(selectedDate, new Date())) {
      toast({
        title: "Past date selected",
        description: "The deadline cannot be set in the past",
        variant: "destructive"
      });
      return;
    }
    
    if (onDeadlineChange) {
      onDeadlineChange(selectedDate);
    }
    
    setIsOpen(false);
    
    if (selectedDate) {
      toast({
        title: "Deadline updated",
        description: `Deadline set to ${format(selectedDate, 'PP')}`,
      });
    } else {
      toast({
        title: "Deadline removed",
        description: "No deadline is set for this item",
      });
    }
  };
  
  const handleClear = () => {
    setDate(null);
    if (onDeadlineChange) {
      onDeadlineChange(null);
    }
    setIsOpen(false);
    
    toast({
      title: "Deadline cleared",
      description: "Deadline has been removed",
    });
  };
  
  // Get remaining days
  const getRemainingDays = () => {
    if (!date) return null;
    return differenceInDays(date, new Date());
  };
  
  // Get deadline status
  const getDeadlineStatus = () => {
    if (!date) return null;
    
    const remainingDays = getRemainingDays();
    
    if (remainingDays === null) return null;
    
    if (remainingDays < 0) {
      return { status: 'overdue', label: 'Overdue' };
    } else if (remainingDays === 0) {
      return { status: 'today', label: 'Due Today' };
    } else if (remainingDays <= 3) {
      return { status: 'imminent', label: `Due Soon (${remainingDays}d)` };
    } else {
      return { status: 'upcoming', label: `${remainingDays} days left` };
    }
  };
  
  const status = getDeadlineStatus();
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium">Deadline</span>
        </div>
        
        {date && status && (
          <Badge variant={
            status.status === 'overdue' ? 'destructive' : 
            status.status === 'today' ? 'destructive' : 
            status.status === 'imminent' ? 'outline' : 
            'secondary'
          }>
            {status.label}
          </Badge>
        )}
      </div>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>No deadline set</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(date) => isBefore(date, addDays(new Date(), -1))}
          />
          <div className="p-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleClear}
            >
              Clear Deadline
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
