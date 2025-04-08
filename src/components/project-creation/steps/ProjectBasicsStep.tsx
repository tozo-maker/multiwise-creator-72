
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          Project Name
        </h2>
        <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Name your project and get started.
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="name" className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Project Name
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
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
          className={isDark 
            ? "border-slate-700 bg-slate-800/70 text-slate-200" 
            : "border-slate-300 bg-white text-slate-900"
          }
        />
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          This name will be used to identify your project throughout the system
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Label className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Approach</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
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
              : isDark ? 'border-slate-700' : 'border-slate-200'} p-0 cursor-pointer ${
                isDark ? 'bg-slate-800/30' : 'bg-white'
              }`}
            onClick={() => updateData({ quickStart: 'template' })}
          >
            <CardContent className="p-0">
              <div className="flex items-start space-x-3 p-4">
                <div className="flex items-center h-5 mt-1">
                  <RadioGroupItem value="template" id="template" />
                </div>
                <div>
                  <Label htmlFor="template" className={`font-medium text-base ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}>Start with a Template</Label>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Choose from pre-configured templates for common educational materials.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`border-2 ${data.quickStart === 'custom' 
              ? 'border-indigo-500' 
              : isDark ? 'border-slate-700' : 'border-slate-200'} p-0 cursor-pointer ${
                isDark ? 'bg-slate-800/30' : 'bg-white'
              }`}
            onClick={() => updateData({ quickStart: 'custom' })}
          >
            <CardContent className="p-0">
              <div className="flex items-start space-x-3 p-4">
                <div className="flex items-center h-5 mt-1">
                  <RadioGroupItem value="custom" id="custom" />
                </div>
                <div>
                  <Label htmlFor="custom" className={`font-medium text-base ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}>Custom Configuration</Label>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Configure your project from scratch with full control over all settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`border-2 ${data.quickStart === 'duplicate' 
              ? 'border-indigo-500' 
              : isDark ? 'border-slate-700' : 'border-slate-200'} p-0 cursor-pointer ${
                isDark ? 'bg-slate-800/30' : 'bg-white'
              }`}
            onClick={() => updateData({ quickStart: 'duplicate' })}
          >
            <CardContent className="p-0">
              <div className="flex items-start space-x-3 p-4">
                <div className="flex items-center h-5 mt-1">
                  <RadioGroupItem value="duplicate" id="duplicate" />
                </div>
                <div>
                  <Label htmlFor="duplicate" className={`font-medium text-base ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}>Duplicate Existing Project</Label>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
