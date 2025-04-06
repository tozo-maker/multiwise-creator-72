
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { ConfigData } from '../types';
import { RadioGroup } from '@/components/ui/radio-group';

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
        
        <div className="grid grid-cols-1 gap-4">
          {/* Using custom approach selection cards with proper onClick handlers instead of RadioGroupItems */}
          <Card 
            className={`border-2 ${data.quickStart === 'template' ? 'border-brand-500' : 'border-brand-100'} p-0 cursor-pointer`}
            onClick={() => updateData({ quickStart: 'template' })}
          >
            <CardContent className="p-0">
              <div className="flex items-start space-x-3 p-4">
                <div className="flex items-center justify-center h-5 mt-1">
                  <div className={`h-4 w-4 rounded-full border ${
                    data.quickStart === 'template' 
                      ? 'border-brand-500 bg-brand-500' 
                      : 'border-primary'
                  }`}>
                    {data.quickStart === 'template' && (
                      <div className="h-2.5 w-2.5 rounded-full bg-white m-auto mt-0.75"></div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-medium">Start with a Template</p>
                  <p className="text-sm text-slate-500">
                    Choose from pre-configured templates for common educational materials.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`border-2 ${data.quickStart === 'custom' ? 'border-brand-500' : 'border-brand-100'} p-0 cursor-pointer`}
            onClick={() => updateData({ quickStart: 'custom' })}
          >
            <CardContent className="p-0">
              <div className="flex items-start space-x-3 p-4">
                <div className="flex items-center justify-center h-5 mt-1">
                  <div className={`h-4 w-4 rounded-full border ${
                    data.quickStart === 'custom' 
                      ? 'border-brand-500 bg-brand-500' 
                      : 'border-primary'
                  }`}>
                    {data.quickStart === 'custom' && (
                      <div className="h-2.5 w-2.5 rounded-full bg-white m-auto mt-0.75"></div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-medium">Custom Configuration</p>
                  <p className="text-sm text-slate-500">
                    Configure your project from scratch with full control over all settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`border-2 ${data.quickStart === 'duplicate' ? 'border-brand-500' : 'border-brand-100'} p-0 cursor-pointer`}
            onClick={() => updateData({ quickStart: 'duplicate' })}
          >
            <CardContent className="p-0">
              <div className="flex items-start space-x-3 p-4">
                <div className="flex items-center justify-center h-5 mt-1">
                  <div className={`h-4 w-4 rounded-full border ${
                    data.quickStart === 'duplicate' 
                      ? 'border-brand-500 bg-brand-500' 
                      : 'border-primary'
                  }`}>
                    {data.quickStart === 'duplicate' && (
                      <div className="h-2.5 w-2.5 rounded-full bg-white m-auto mt-0.75"></div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-medium">Duplicate Existing Project</p>
                  <p className="text-sm text-slate-500">
                    Clone an existing project as a starting point.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
