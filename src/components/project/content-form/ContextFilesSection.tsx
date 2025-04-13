
import React from 'react';
import { FileText, Upload, PlusCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface ContextFile {
  id: string;
  name: string;
  instructions: string;
}

interface ContextFilesSectionProps {
  contextFiles: ContextFile[];
  setContextFiles: React.Dispatch<React.SetStateAction<ContextFile[]>>;
  openKnowledgeBaseDialog: () => void;
  projectId?: string; // Add projectId as optional prop
  selectedFiles?: string[];
  onSelectedFilesChange?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ContextFilesSection: React.FC<ContextFilesSectionProps> = ({
  contextFiles,
  setContextFiles,
  openKnowledgeBaseDialog,
  projectId,
  selectedFiles,
  onSelectedFilesChange
}) => {
  const handleRemoveContextFile = (id: string) => {
    setContextFiles(contextFiles.filter(file => file.id !== id));
  };
  
  const updateFileInstructions = (id: string, instructions: string) => {
    setContextFiles(contextFiles.map(file => 
      file.id === id ? { ...file, instructions } : file
    ));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label>Add Context/Examples (Optional)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">
                  Adding files from your Knowledge Base helps the AI generate more accurate and relevant content.
                  You can add custom instructions for each file to guide how the AI should use it.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={openKnowledgeBaseDialog}>
            <FileText className="h-4 w-4" />
            Select from Knowledge Base
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload New File
          </Button>
        </div>
      </div>
      
      {contextFiles.length > 0 ? (
        <div className="space-y-3">
          {contextFiles.map((file) => (
            <Card key={file.id} className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">{file.name}</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveContextFile(file.id)}
                    className="h-6 w-6 text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <Label htmlFor={`instructions-${file.id}`} className="text-xs">
                    Instructions for AI (how to use this file)
                  </Label>
                  <Textarea 
                    id={`instructions-${file.id}`}
                    value={file.instructions}
                    onChange={(e) => updateFileInstructions(file.id, e.target.value)}
                    placeholder="E.g., Use this to follow the curriculum standards, Extract terminology from this document..."
                    className="min-h-[80px] text-sm"
                  />
                  
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox id={`add-kb-${file.id}`} />
                    <Label htmlFor={`add-kb-${file.id}`} className="text-xs">
                      Add this file to Knowledge Base
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border rounded-md p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
            <PlusCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-foreground mb-1">No context files selected</p>
          <p className="text-xs text-muted-foreground">
            Select files from your Knowledge Base or upload new ones to provide context for generation
          </p>
        </div>
      )}
    </div>
  );
};
