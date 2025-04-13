
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { OutlineItem } from '@/types/outline';
import { Pencil, Check, X, Trash2, ChevronUp, ChevronDown, FileText, CircleDashed, CircleCheck, CircleAlert, Clock, Calendar } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OutlineItemComponentProps {
  item: OutlineItem;
  onUpdate: (item: OutlineItem) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const OutlineItemComponent: React.FC<OutlineItemComponentProps> = ({
  item,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || '');
  const [status, setStatus] = useState<"not_started" | "in_progress" | "completed">(item.status);
  const [completionPercentage, setCompletionPercentage] = useState(item.metadata?.completionPercentage || getDefaultCompletionPercentage(item.status));
  const [dueDate, setDueDate] = useState<string>(item.metadata?.dueDate || '');
  
  function getDefaultCompletionPercentage(status: string): number {
    switch(status) {
      case 'not_started': return 0;
      case 'in_progress': return 50;
      case 'completed': return 100;
      default: return 0;
    }
  }

  const getFormattedDueDate = () => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    
    // Check if the due date is in the past
    const isPastDue = date < today;
    
    return { formattedDate, isPastDue };
  };
  
  const handleSaveEdit = () => {
    let newCompletionPercentage = completionPercentage;
    
    // Update completion percentage if status changed
    if (status !== item.status) {
      newCompletionPercentage = getDefaultCompletionPercentage(status);
      setCompletionPercentage(newCompletionPercentage);
    }
    
    const updatedItem = {
      ...item,
      title,
      description,
      status,
      metadata: {
        ...(item.metadata || {}),
        completionPercentage: newCompletionPercentage,
        dueDate: dueDate || null
      }
    };
    onUpdate(updatedItem);
    setEditing(false);
  };
  
  const handleCancelEdit = () => {
    setTitle(item.title);
    setDescription(item.description || '');
    setStatus(item.status);
    setCompletionPercentage(item.metadata?.completionPercentage || getDefaultCompletionPercentage(item.status));
    setDueDate(item.metadata?.dueDate || '');
    setEditing(false);
  };
  
  const handleStatusChange = (newStatus: "not_started" | "in_progress" | "completed") => {
    setStatus(newStatus);
    if (newStatus === 'completed') {
      setCompletionPercentage(100);
    } else if (newStatus === 'not_started') {
      setCompletionPercentage(0);
    }
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case 'not_started':
        return <CircleDashed size={16} className="text-slate-400" />;
      case 'in_progress':
        return <CircleAlert size={16} className="text-amber-500" />;
      case 'completed':
        return <CircleCheck size={16} className="text-green-500" />;
      default:
        return <CircleDashed size={16} className="text-slate-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'not_started':
        return isDark ? 'bg-slate-700' : 'bg-slate-100';
      case 'in_progress':
        return isDark ? 'bg-amber-900/30' : 'bg-amber-50';
      case 'completed':
        return isDark ? 'bg-green-900/30' : 'bg-green-50';
      default:
        return isDark ? 'bg-slate-700' : 'bg-slate-100';
    }
  };
  
  const formattedDueDate = getFormattedDueDate();
  
  if (editing) {
    return (
      <Card className={`border p-3 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}>
        <div className="space-y-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Item title"
            className="font-medium"
          />
          
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Item description (optional)"
            className="text-sm"
            rows={2}
          />
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <span className="text-sm mr-2">Status:</span>
              <Select 
                value={status} 
                onValueChange={(value: "not_started" | "in_progress" | "completed") => handleStatusChange(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <span className="text-sm mr-2">Completion:</span>
              <Select 
                value={String(completionPercentage)} 
                onValueChange={(value) => setCompletionPercentage(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0%</SelectItem>
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="75">75%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <span className="text-sm mr-2">Due Date:</span>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleCancelEdit} className="gap-1">
              <X size={14} /> Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleSaveEdit} className="gap-1">
              <Check size={14} /> Save
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className={`border ${getStatusColor()}`}>
      <CardContent className="p-3">
        <div className="flex justify-between">
          <div className="flex items-start gap-2">
            <div className="mt-1">{getStatusIcon()}</div>
            <div className="flex-1">
              <div className="font-medium text-sm">{item.title}</div>
              {item.description && (
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                  {item.description}
                </p>
              )}
              
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">Progress</span>
                  <span className="text-xs font-medium">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-1.5" />
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                {item.contentId && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1">
                          <FileText size={12} className="text-blue-500" />
                          <span className="text-xs text-blue-500">Content Linked</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This item is linked to content</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {formattedDueDate && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className={formattedDueDate.isPastDue ? "text-red-500" : "text-slate-500"} />
                          <span className={`text-xs ${formattedDueDate.isPastDue ? "text-red-500 font-medium" : "text-slate-500"}`}>
                            {formattedDueDate.formattedDate}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{formattedDueDate.isPastDue ? "Past due" : "Due date"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditing(true)}
              className="h-6 w-6"
            >
              <Pencil size={12} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="h-6 w-6"
            >
              <ChevronUp size={12} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="h-6 w-6"
            >
              <ChevronDown size={12} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onDelete} 
              className="h-6 w-6 text-red-500"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
