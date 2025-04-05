
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface ProjectConfigStepProps {
  data: {
    language: string;
    targetAudience: string;
    complexity: string;
  };
  updateData: (data: Partial<{
    language: string;
    targetAudience: string;
    complexity: string;
  }>) => void;
  isMobile?: boolean;
}

export function ProjectConfigStep({ data, updateData, isMobile = false }: ProjectConfigStepProps) {
  const languages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 
    'Japanese', 'Arabic', 'Russian', 'Portuguese'
  ];
  
  const audiences = [
    { value: 'elementary', label: 'Elementary School' },
    { value: 'middle', label: 'Middle School' },
    { value: 'high', label: 'High School' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'graduate', label: 'Graduate' },
    { value: 'professional', label: 'Professional' },
    { value: 'general', label: 'General Audience' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="language">Primary Language</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">The main language for your educational content</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={data.language} onValueChange={(value) => updateData({ language: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((language) => (
              <SelectItem key={language} value={language}>{language}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="targetAudience">Target Audience</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">The primary audience for your educational materials</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={data.targetAudience} onValueChange={(value) => updateData({ targetAudience: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select target audience" />
          </SelectTrigger>
          <SelectContent>
            {audiences.map((audience) => (
              <SelectItem key={audience.value} value={audience.value}>{audience.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="complexity">Content Complexity</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">How complex should the educational content be</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Badge variant="outline" className="font-normal">
            {data.complexity}
          </Badge>
        </div>
        
        <RadioGroup 
          value={data.complexity}
          onValueChange={(value) => updateData({ complexity: value })}
          className="flex space-x-1"
        >
          <div className="grid grid-cols-5 gap-2 w-full">
            {['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
              <div 
                key={level} 
                className={`
                  flex flex-col items-center justify-center p-2 rounded-md cursor-pointer border
                  ${data.complexity === level 
                    ? 'bg-brand-100 border-brand-400' 
                    : 'border-slate-200 hover:bg-slate-50'
                  }
                `}
                onClick={() => updateData({ complexity: level })}
              >
                <RadioGroupItem value={level} id={level} className="sr-only" />
                <Label htmlFor={level} className="cursor-pointer text-center text-xs">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Enable Interactive Elements</Label>
              <p className="text-xs text-muted-foreground">
                Include interactive elements in your content
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
