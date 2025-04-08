
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ProjectBasicsStepProps {
  data: {
    name: string;
    description: string;
    language: string;
    targetAudience: string;
    complexity: string;
    quickStart?: string;
  };
  updateData: (data: Partial<ProjectBasicsStepProps['data']>) => void;
  isMobile?: boolean;
}

export function ProjectBasicsStep({ data, updateData, isMobile = false }: ProjectBasicsStepProps) {
  const languageOptions = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'];
  const complexityOptions = ['Beginner', 'Intermediate', 'Advanced', 'Mixed'];
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-slate-100">Project Name</h2>
        <p className="text-slate-400 mb-6">Name your project and get started.</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="name" className="text-slate-200 font-medium">Project Name</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Give your project a descriptive name</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="name"
          placeholder="Enter project name"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          className="border-slate-700 bg-slate-800/70 text-slate-200"
        />
        <p className="text-sm text-slate-400 mt-1">
          This name will be used to identify your project throughout the system
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Label className="text-slate-200 font-medium">Approach</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Choose how you want to start your project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <RadioGroup 
          value={data.quickStart || 'custom'} 
          onValueChange={(value) => updateData({ quickStart: value })}
          className="space-y-4"
        >
          <Card 
            className={`border-2 ${data.quickStart === 'template' 
              ? 'border-indigo-500' 
              : 'border-slate-700'} p-0 cursor-pointer bg-slate-800/30`}
            onClick={() => updateData({ quickStart: 'template' })}
          >
            <CardContent className="p-0">
              <div className="flex items-start space-x-3 p-4">
                <div className="flex items-center h-5 mt-1">
                  <RadioGroupItem value="template" id="template" />
                </div>
                <div>
                  <Label htmlFor="template" className="font-medium text-base text-slate-200">Start with a Template</Label>
                  <p className="text-sm text-slate-400">
                    Choose from pre-configured templates for common educational materials.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`border-2 ${data.quickStart === 'custom' 
              ? 'border-indigo-500' 
              : 'border-slate-700'} p-0 cursor-pointer bg-slate-800/30`}
            onClick={() => updateData({ quickStart: 'custom' })}
          >
            <CardContent className="p-0">
              <div className="flex items-start space-x-3 p-4">
                <div className="flex items-center h-5 mt-1">
                  <RadioGroupItem value="custom" id="custom" />
                </div>
                <div>
                  <Label htmlFor="custom" className="font-medium text-base text-slate-200">Custom Configuration</Label>
                  <p className="text-sm text-slate-400">
                    Configure your project from scratch with full control over all settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`border-2 ${data.quickStart === 'duplicate' 
              ? 'border-indigo-500' 
              : 'border-slate-700'} p-0 cursor-pointer bg-slate-800/30`}
            onClick={() => updateData({ quickStart: 'duplicate' })}
          >
            <CardContent className="p-0">
              <div className="flex items-start space-x-3 p-4">
                <div className="flex items-center h-5 mt-1">
                  <RadioGroupItem value="duplicate" id="duplicate" />
                </div>
                <div>
                  <Label htmlFor="duplicate" className="font-medium text-base text-slate-200">Duplicate Existing Project</Label>
                  <p className="text-sm text-slate-400">
                    Clone an existing project as a starting point.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>
      </div>
    </div>
  );
}
