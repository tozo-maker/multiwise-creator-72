
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { ConfigData } from '../types';

interface ProjectNameStepProps {
  data: Pick<ConfigData, 'name' | 'quickStart'>;
  updateData: (data: Partial<ConfigData>) => void;
}

export const ProjectNameStep: React.FC<ProjectNameStepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="projectName">Project Name</Label>
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
          id="projectName" 
          value={data.name} 
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="Enter project name"
          className="w-full"
          autoFocus
        />
        <p className="text-sm text-muted-foreground mt-1">
          This name will be used to identify your project throughout the system
        </p>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label>Approach</Label>
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
          value={data.quickStart}
          onValueChange={(value) => updateData({ quickStart: value })}
          className="grid grid-cols-1 gap-4"
        >
          <Card className={`border-2 ${data.quickStart === 'template' ? 'border-brand-500' : 'border-brand-100'} p-0 cursor-pointer`}>
            <CardContent className="p-0">
              <label className="flex items-start space-x-3 p-4 cursor-pointer">
                <RadioGroupItem value="template" id="template" className="mt-1" />
                <div>
                  <p className="font-medium">Start with a Template</p>
                  <p className="text-sm text-slate-500">
                    Choose from pre-configured templates for common educational materials.
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>
          
          <Card className={`border-2 ${data.quickStart === 'custom' ? 'border-brand-500' : 'border-brand-100'} p-0 cursor-pointer`}>
            <CardContent className="p-0">
              <label className="flex items-start space-x-3 p-4 cursor-pointer">
                <RadioGroupItem value="custom" id="custom" className="mt-1" />
                <div>
                  <p className="font-medium">Custom Configuration</p>
                  <p className="text-sm text-slate-500">
                    Configure your project from scratch with full control over all settings.
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>
          
          <Card className={`border-2 ${data.quickStart === 'duplicate' ? 'border-brand-500' : 'border-brand-100'} p-0 cursor-pointer`}>
            <CardContent className="p-0">
              <label className="flex items-start space-x-3 p-4 cursor-pointer">
                <RadioGroupItem value="duplicate" id="duplicate" className="mt-1" />
                <div>
                  <p className="font-medium">Duplicate Existing Project</p>
                  <p className="text-sm text-slate-500">
                    Clone an existing project as a starting point.
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>
        </RadioGroup>
      </div>
    </div>
  );
};
