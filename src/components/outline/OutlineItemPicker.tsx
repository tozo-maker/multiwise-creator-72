
import React, { useState } from 'react';
import { ProjectOutline, OutlineItem } from '@/types/outline';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronRight, FileCheck, FileText, XCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface OutlineItemPickerProps {
  outline: ProjectOutline;
  selectedItem: OutlineItem | null;
  onSelectItem: (item: OutlineItem | null) => void;
}

export const OutlineItemPicker: React.FC<OutlineItemPickerProps> = ({
  outline,
  selectedItem,
  onSelectItem
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleSelectItem = (item: OutlineItem) => {
    onSelectItem(item);
    setIsDialogOpen(false);
  };
  
  const handleClearSelection = () => {
    onSelectItem(null);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'not_started':
        return (
          <Badge variant="outline" className="ml-2 bg-slate-200 text-slate-700">
            Not Started
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-300">
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          Outline Item
        </Label>
      </div>
      
      {selectedItem ? (
        <div className={`p-3 border rounded-md flex justify-between items-start ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
          <div>
            <div className="flex items-center">
              <FileCheck size={16} className="mr-2 text-blue-500" />
              <span className="font-medium">{selectedItem.title}</span>
              {getStatusBadge(selectedItem.status)}
            </div>
            {selectedItem.description && (
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {selectedItem.description}
              </p>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleClearSelection}
            className="h-8 w-8 p-0"
          >
            <XCircle size={16} />
          </Button>
        </div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className={`w-full justify-start text-left h-auto py-3 px-4 ${isDark ? 'border-slate-700' : 'border-slate-300'}`}
            >
              <FileText size={16} className="mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Select an outline item</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle>Select Outline Item</DialogTitle>
              <DialogDescription>
                Choose an item from your outline to associate with this content
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="h-[50vh]">
              <div className="space-y-4 px-1">
                {outline.sections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {section.title}
                    </h3>
                    <div className="space-y-1 ml-4">
                      {section.items.map((item) => (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className={`w-full justify-between h-auto p-2 text-left ${
                            isDark 
                              ? 'hover:bg-slate-700' 
                              : 'hover:bg-slate-100'
                          }`}
                          onClick={() => handleSelectItem(item)}
                        >
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <FileText size={14} className={item.contentId ? 'text-blue-500' : 'text-gray-500'} />
                              <span>{item.title}</span>
                            </div>
                            {item.description && (
                              <p className={`mt-1 text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center">
                            {getStatusBadge(item.status)}
                            <ChevronRight size={16} className="ml-2" />
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
