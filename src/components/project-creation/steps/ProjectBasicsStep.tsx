
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProjectBasicsStepProps {
  data: {
    name: string;
    description: string;
    type: string;
    templateId: string;
  };
  updateData: (data: Partial<{
    name: string;
    description: string;
    type: string;
  }>) => void;
  isMobile?: boolean;
}

export function ProjectBasicsStep({ data, updateData, isMobile = false }: ProjectBasicsStepProps) {
  const projectTypes = [
    { value: 'textbook', label: 'Textbook' },
    { value: 'course', label: 'Course' },
    { value: 'lesson', label: 'Lesson Plan' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'worksheet', label: 'Worksheet' },
    { value: 'other', label: 'Other' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="name">Project Name</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Give your project a descriptive name to easily identify it later</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input 
          id="name"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="My Educational Project"
          className="w-full"
          autoFocus
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="description">Description</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">A brief description of what this project is about</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Textarea 
          id="description"
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          placeholder="Enter a brief description of your project..."
          className="min-h-[100px] resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="type">Project Type</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">The type of educational content you want to create</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={data.type} onValueChange={(value) => updateData({ type: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select project type" />
          </SelectTrigger>
          <SelectContent>
            {projectTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Card className="bg-brand-50 border-brand-100">
        <CardContent className="pt-4 text-sm text-muted-foreground">
          <p>Your project settings can always be modified later from the project configuration page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
