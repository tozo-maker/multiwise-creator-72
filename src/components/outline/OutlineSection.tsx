
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { OutlineSection as OutlineSectionType, OutlineItem } from '@/types/outline';
import { OutlineItemComponent } from './OutlineItem';
import { PlusCircle, Trash2, ChevronDown, ChevronUp, Pencil, Check, X, GripVertical } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface OutlineSectionProps {
  section: OutlineSectionType;
  projectId: string;
  onUpdate: (section: OutlineSectionType) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const OutlineSection: React.FC<OutlineSectionProps> = ({
  section,
  projectId,
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
  const [title, setTitle] = useState(section.title);
  const [description, setDescription] = useState(section.description || '');
  const [isExpanded, setIsExpanded] = useState(true);
  
  const handleSaveEdit = () => {
    const updatedSection = {
      ...section,
      title,
      description,
    };
    onUpdate(updatedSection);
    setEditing(false);
  };
  
  const handleCancelEdit = () => {
    setTitle(section.title);
    setDescription(section.description || '');
    setEditing(false);
  };
  
  const handleAddItem = () => {
    const newItem: OutlineItem = {
      id: `new-${Date.now()}`,
      title: 'New Item',
      description: '',
      parentId: undefined,
      order: section.items.length,
      projectId,
      status: 'not_started',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedSection = {
      ...section,
      items: [...section.items, newItem]
    };
    onUpdate(updatedSection);
  };
  
  const handleUpdateItem = (updatedItem: OutlineItem) => {
    const updatedItems = section.items.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    
    onUpdate({
      ...section,
      items: updatedItems
    });
  };
  
  const handleDeleteItem = (itemId: string) => {
    const updatedItems = section.items.filter(item => item.id !== itemId);
    
    onUpdate({
      ...section,
      items: updatedItems
    });
  };
  
  const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
    const itemIndex = section.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    const newItems = [...section.items];
    
    if (direction === 'up' && itemIndex > 0) {
      // Swap with previous item
      const temp = newItems[itemIndex];
      newItems[itemIndex] = newItems[itemIndex - 1];
      newItems[itemIndex - 1] = temp;
      
      // Update order values
      newItems[itemIndex].order = itemIndex;
      newItems[itemIndex - 1].order = itemIndex - 1;
    } else if (direction === 'down' && itemIndex < newItems.length - 1) {
      // Swap with next item
      const temp = newItems[itemIndex];
      newItems[itemIndex] = newItems[itemIndex + 1];
      newItems[itemIndex + 1] = temp;
      
      // Update order values
      newItems[itemIndex].order = itemIndex;
      newItems[itemIndex + 1].order = itemIndex + 1;
    }
    
    onUpdate({
      ...section,
      items: newItems
    });
  };
  
  return (
    <Card className={`border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
      <CardHeader className={`px-4 py-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-t-lg flex flex-row justify-between`}>
        {editing ? (
          <div className="space-y-2 w-full">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Section title"
              className="font-medium"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Section description (optional)"
              className="text-sm"
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit} className="gap-1">
                <X size={14} /> Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSaveEdit} className="gap-1">
                <Check size={14} /> Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-7 w-7"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </Button>
              <div>
                <h3 className="font-medium text-base">{title}</h3>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditing(true)}
                className="h-7 w-7"
              >
                <Pencil size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onMoveUp}
                disabled={!canMoveUp}
                className="h-7 w-7"
              >
                <ChevronUp size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onMoveDown}
                disabled={!canMoveDown}
                className="h-7 w-7"
              >
                <ChevronDown size={14} />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                    <Trash2 size={14} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Section</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this section and all its items?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-red-500 text-white hover:bg-red-600">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="px-4 py-3 space-y-2">
          {section.items.map((item, index) => (
            <OutlineItemComponent
              key={item.id}
              item={item}
              onUpdate={handleUpdateItem}
              onDelete={() => handleDeleteItem(item.id)}
              onMoveUp={() => handleMoveItem(item.id, 'up')}
              onMoveDown={() => handleMoveItem(item.id, 'down')}
              canMoveUp={index > 0}
              canMoveDown={index < section.items.length - 1}
            />
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            className="w-full border-dashed mt-2 gap-1"
          >
            <PlusCircle size={14} />
            Add Item
          </Button>
        </CardContent>
      )}
    </Card>
  );
};
