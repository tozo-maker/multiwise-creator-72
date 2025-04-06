
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoCircle, HelpCircle } from 'lucide-react';
import { ConfigData } from '../types';

interface SystemConfigStepProps {
  data: Pick<ConfigData, 
    'interfaceLanguage' | 
    'experienceLevel' | 
    'interactionMode' |
    'outputDetail' |
    'systemBehavior'
  >;
  updateData: (data: Partial<ConfigData>) => void;
}

export const SystemConfigStep: React.FC<SystemConfigStepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Configure how you want to interact with the system and how it should respond to you.
      </div>
      
      {/* Language Preference */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="interfaceLanguage">Interface Language</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Language for system prompts and interface elements</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Select 
          value={data.interfaceLanguage} 
          onValueChange={(value) => updateData({ interfaceLanguage: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select interface language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Chinese">Chinese</SelectItem>
            <SelectItem value="Japanese">Japanese</SelectItem>
            <SelectItem value="Arabic">Arabic</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Experience Level */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label>User Experience Level</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Your familiarity with educational content development</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <RadioGroup 
          value={data.experienceLevel}
          onValueChange={(value) => updateData({ experienceLevel: value })}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <div 
              key={level} 
              className={`
                flex flex-col items-center p-4 rounded-md border cursor-pointer
                ${data.experienceLevel === level 
                  ? 'bg-brand-50 border-brand-500' 
                  : 'border-slate-200 hover:bg-slate-50'
                }
              `}
              onClick={() => updateData({ experienceLevel: level })}
            >
              <RadioGroupItem value={level} id={`experience-${level}`} className="sr-only" />
              <Label htmlFor={`experience-${level}`} className="cursor-pointer text-center">
                <div className="font-medium">{level}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {level === 'Beginner' && "I'm new to creating educational materials"}
                  {level === 'Intermediate' && "I have some experience with content creation"}
                  {level === 'Advanced' && "I'm experienced in educational content development"}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Interaction Mode */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="interactionMode">Interaction Mode</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">How you'd prefer to interact with the system</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <RadioGroup 
              value={data.interactionMode}
              onValueChange={(value) => updateData({ interactionMode: value })}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                { value: 'Conversational', label: 'Conversational', description: 'Interact through natural dialogue' },
                { value: 'Structured', label: 'Structured', description: 'Guided form-based interaction' },
                { value: 'Direct', label: 'Direct', description: 'Minimal interaction, focus on results' },
                { value: 'Collaborative', label: 'Collaborative', description: 'Iterative back-and-forth approach' }
              ].map((mode) => (
                <div 
                  key={mode.value} 
                  className={`
                    flex items-start p-4 rounded-md border cursor-pointer
                    ${data.interactionMode === mode.value 
                      ? 'bg-brand-50 border-brand-500' 
                      : 'border-slate-200 hover:bg-slate-50'
                    }
                  `}
                  onClick={() => updateData({ interactionMode: mode.value })}
                >
                  <RadioGroupItem value={mode.value} id={`mode-${mode.value}`} className="mt-1" />
                  <Label htmlFor={`mode-${mode.value}`} className="cursor-pointer ml-3">
                    <div className="font-medium">{mode.label}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {mode.description}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
      
      {/* Output Detail */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="outputDetail">Output Detail Level</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">How detailed should system responses be</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Select 
          value={data.outputDetail} 
          onValueChange={(value) => updateData({ outputDetail: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select output detail" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Concise">Concise - Brief, to-the-point information</SelectItem>
            <SelectItem value="Balanced">Balanced - Moderate level of detail</SelectItem>
            <SelectItem value="Detailed">Detailed - Comprehensive explanations</SelectItem>
            <SelectItem value="Exhaustive">Exhaustive - All possible information</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* System Behavior */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="systemBehavior">System Behavior Style</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">How the system should behave when assisting you</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Select 
          value={data.systemBehavior} 
          onValueChange={(value) => updateData({ systemBehavior: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select system behavior" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Collaborative">Collaborative - Work together on solutions</SelectItem>
            <SelectItem value="Instructive">Instructive - Provide guidance and explanation</SelectItem>
            <SelectItem value="Proactive">Proactive - Anticipate needs and offer suggestions</SelectItem>
            <SelectItem value="Responsive">Responsive - React to specific requests only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
