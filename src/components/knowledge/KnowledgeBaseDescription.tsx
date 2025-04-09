
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { KBFile } from './KnowledgeBaseFileList';

interface KnowledgeBaseDescriptionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentFile: KBFile | null;
  description: string;
  onDescriptionChange: (description: string) => void;
  onSave: () => void;
}

export const KnowledgeBaseDescription: React.FC<KnowledgeBaseDescriptionProps> = ({
  isOpen,
  onOpenChange,
  currentFile,
  description,
  onDescriptionChange,
  onSave
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}>
        <DialogHeader>
          <DialogTitle className={isDark ? "text-slate-100" : "text-slate-900"}>Edit File Description</DialogTitle>
          <DialogDescription className={isDark ? "text-slate-400" : "text-slate-500"}>
            Update the description for {currentFile?.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Label htmlFor="description" className={isDark ? "text-slate-300" : "text-slate-700"}>Description</Label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={e => onDescriptionChange(e.target.value)} 
            placeholder="Enter a description for this file..." 
            className={`mt-2 ${isDark ? "bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"}`} 
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className={isDark ? "border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100" : "border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"}
          >
            Cancel
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={onSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
