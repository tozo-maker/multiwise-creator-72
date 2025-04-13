
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { OutlineItem } from '@/types/outline';
import { Pencil, Check, X, Trash2, ChevronUp, ChevronDown, FileText, CircleDashed, CircleCheck, CircleAlert } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  
  const handleSaveEdit = () => {
    const updatedItem = {
      ...item,
      title,
      description,
      status
    };
    onUpdate(updatedItem);
    setEditing(false);
  };
  
  const handleCancelEdit = () => {
    setTitle(item.title);
    setDescription(item.description || '');
    setStatus(item.status);
    setEditing(false);
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
          
          <div className="flex items-center">
            <span className="mr-2 text-sm">Status:</span>
            <Select 
              value={status} 
              onValueChange={(value: "not_started" | "in_progress" | "completed") => setStatus(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
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
      <CardContent className="p-3 flex justify-between items-start">
        <div className="flex items-start gap-2">
          <div className="mt-1">{getStatusIcon()}</div>
          <div>
            <div className="font-medium text-sm">{item.title}</div>
            {item.description && (
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                {item.description}
              </p>
            )}
            {item.contentId && (
              <div className="flex items-center gap-1 mt-1">
                <FileText size={12} className="text-blue-500" />
                <span className="text-xs text-blue-500">Linked to content</span>
              </div>
            )}
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
      </CardContent>
    </Card>
  );
};
