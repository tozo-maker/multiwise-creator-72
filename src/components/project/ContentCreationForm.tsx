
import React, { useState } from 'react';
import { FileText, Upload, Plus, HelpCircle, PlusCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';

interface ContextFile {
  id: string;
  name: string;
  instructions: string;
}

export const ContentCreationForm = () => {
  const [title, setTitle] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [selectKBDialogOpen, setSelectKBDialogOpen] = useState(false);
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mock KB files for the dialog
  const knowledgeBaseFiles = [
    { id: '1', name: 'Curriculum Standards.pdf', description: 'National curriculum standards' },
    { id: '2', name: 'Style Guide.docx', description: 'Official writing style guidelines' },
    { id: '3', name: 'Example Chapter.docx', description: 'Example chapter with formatting' },
    { id: '4', name: 'Terminology.txt', description: 'Approved terminology list' },
    { id: '5', name: 'Cultural References.pdf', description: 'Cultural context document' },
  ];
  
  const [selectedKBFiles, setSelectedKBFiles] = useState<string[]>([]);
  
  const handleAddToContext = () => {
    const newContextFiles = knowledgeBaseFiles
      .filter(file => selectedKBFiles.includes(file.id))
      .map(file => ({
        id: file.id,
        name: file.name,
        instructions: ''
      }));
    
    setContextFiles([...contextFiles, ...newContextFiles]);
    setSelectedKBFiles([]);
    setSelectKBDialogOpen(false);
  };
  
  const handleRemoveContextFile = (id: string) => {
    setContextFiles(contextFiles.filter(file => file.id !== id));
  };
  
  const updateFileInstructions = (id: string, instructions: string) => {
    setContextFiles(contextFiles.map(file => 
      file.id === id ? { ...file, instructions } : file
    ));
  };
  
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false);
      // Here you would handle the response and display the generated content
    }, 3000);
  };
  
  return (
    <div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Chapter/Section Title</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="identifier">Identifier (Optional)</Label>
            <Input 
              id="identifier" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g., Chapter 3, Section 2.1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Add Context/Examples (Optional)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-slate-400" />
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
              <Dialog open={selectKBDialogOpen} onOpenChange={setSelectKBDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Select from Knowledge Base
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Knowledge Base Files</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                      {knowledgeBaseFiles.map((file) => (
                        <div 
                          key={file.id} 
                          className="flex items-start space-x-3 p-3 rounded-md border border-slate-200 hover:bg-slate-50"
                        >
                          <Checkbox 
                            id={`kb-${file.id}`} 
                            checked={selectedKBFiles.includes(file.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedKBFiles([...selectedKBFiles, file.id]);
                              } else {
                                setSelectedKBFiles(selectedKBFiles.filter(id => id !== file.id));
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
                              <p className="text-xs text-slate-500 mt-1">{file.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {knowledgeBaseFiles.length === 0 && (
                        <div className="text-center py-6 text-slate-500">
                          No files available in the Knowledge Base
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectKBDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddToContext} disabled={selectedKBFiles.length === 0}>
                      Add Selected
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload New File
              </Button>
            </div>
          </div>
          
          {contextFiles.length > 0 ? (
            <div className="space-y-3">
              {contextFiles.map((file) => (
                <Card key={file.id} className="border-slate-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <CardTitle className="text-sm font-medium">{file.name}</CardTitle>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveContextFile(file.id)}
                        className="h-6 w-6 text-slate-400"
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
            <div className="border border-dashed border-slate-300 rounded-md p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <PlusCircle className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-600 mb-1">No context files selected</p>
              <p className="text-xs text-slate-500">
                Select files from your Knowledge Base or upload new ones to provide context for generation
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline">
            Save Draft
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !title}
            className="bg-brand-500 hover:bg-brand-600 gap-2"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
