
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface KnowledgeBaseFile {
  id: string;
  name: string;
  description: string;
}

interface ContextFile {
  id: string;
  name: string;
  instructions: string;
}

interface KnowledgeBaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  knowledgeBaseFiles: KnowledgeBaseFile[];
  selectedFiles: string[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<string[]>>;
  addFilesToContext: () => void;
}

export const KnowledgeBaseDialog: React.FC<KnowledgeBaseDialogProps> = ({
  isOpen,
  onOpenChange,
  knowledgeBaseFiles,
  selectedFiles,
  setSelectedFiles,
  addFilesToContext
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Knowledge Base Files</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {knowledgeBaseFiles.map((file) => (
              <div 
                key={file.id} 
                className="flex items-start space-x-3 p-3 rounded-md border border-border hover:bg-secondary/50"
              >
                <Checkbox 
                  id={`kb-${file.id}`} 
                  checked={selectedFiles.includes(file.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedFiles([...selectedFiles, file.id]);
                    } else {
                      setSelectedFiles(selectedFiles.filter(id => id !== file.id));
                    }
                  }}
                />
                <div className="flex flex-col">
                  <Label 
                    htmlFor={`kb-${file.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {file.name}
                  </Label>
                  {file.description && (
                    <p className="text-xs text-muted-foreground mt-1">{file.description}</p>
                  )}
                </div>
              </div>
            ))}
            
            {knowledgeBaseFiles.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No files available in the Knowledge Base
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={addFilesToContext} disabled={selectedFiles.length === 0}>
            Add Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
