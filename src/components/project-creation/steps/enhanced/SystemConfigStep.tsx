
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Languages, User, MessageSquare, FileText, Bot } from 'lucide-react';
import { EnhancedProjectData } from '../../types/project-wizard-types';
import { useTheme } from '@/contexts/ThemeContext';

interface SystemConfigStepProps {
  data: EnhancedProjectData;
  updateData: (data: Partial<EnhancedProjectData>) => void;
}

export function SystemConfigStep({ data, updateData }: SystemConfigStepProps) {
  const { isDark } = useTheme();
  
  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Arabic', label: 'Arabic' },
  ];
  
  const experienceLevelOptions = [
    { 
      value: 'Beginner', 
      label: 'Beginner',
      description: 'New to creating educational content, need extensive guidance'
    },
    { 
      value: 'Intermediate', 
      label: 'Intermediate',
      description: 'Some experience creating educational materials'
    },
    { 
      value: 'Advanced', 
      label: 'Advanced',
      description: 'Experienced educator or content creator'
    }
  ];
  
  const interactionModeOptions = [
    {
      value: 'Conversational',
      label: 'Conversational',
      description: 'Natural dialogue-based interaction'
    },
    {
      value: 'Guided',
      label: 'Guided',
      description: 'Step-by-step structured approach'
    },
    {
      value: 'Direct',
      label: 'Direct',
      description: 'Minimal interaction, focus on results'
    }
  ];
  
  const outputDetailOptions = [
    {
      value: 'Concise',
      label: 'Concise',
      description: 'Brief outputs with essential information only'
    },
    {
      value: 'Balanced',
      label: 'Balanced',
      description: 'Moderate level of detail and explanation'
    },
    {
      value: 'Detailed',
      label: 'Detailed',
      description: 'Comprehensive explanations with examples'
    }
  ];
  
  const systemBehaviorOptions = [
    {
      value: 'Collaborative',
      label: 'Collaborative',
      description: 'Offers suggestions and works alongside you'
    },
    {
      value: 'Assistant',
      label: 'Assistant',
      description: 'Provides help when asked, stays in background'
    },
    {
      value: 'Proactive',
      label: 'Proactive',
      description: 'Anticipates needs and offers solutions'
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center">
          <Languages className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Interface Language
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                The language used for all system interface elements
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Choose the language you want to use for the interface
        </p>
        
        <Select 
          value={data.interfaceLanguage} 
          onValueChange={(value) => updateData({ interfaceLanguage: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select interface language" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center">
          <User className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Experience Level
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                This helps tailor guidance and suggestions to your experience level
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Select your experience level with creating educational content
        </p>
        
        <RadioGroup 
          value={data.experienceLevel}
          onValueChange={(value) => updateData({ experienceLevel: value })}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {experienceLevelOptions.map(option => (
            <div key={option.value} className="relative">
              <RadioGroupItem 
                value={option.value} 
                id={`experience-${option.value}`}
                className="absolute opacity-0"
              />
              <Label
                htmlFor={`experience-${option.value}`}
                className={`block rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                  data.experienceLevel === option.value 
                    ? `${isDark ? 'bg-indigo-950/50 border-indigo-500' : 'bg-indigo-50 border-indigo-500'}`
                    : `${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300'}`
                }`}
              >
                <div className="font-medium mb-1">{option.label}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center">
          <MessageSquare className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Interaction Mode
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                How you prefer to interact with the system when creating content
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Choose how you want to interact with the system
        </p>
        
        <RadioGroup 
          value={data.interactionMode}
          onValueChange={(value) => updateData({ interactionMode: value })}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {interactionModeOptions.map(option => (
            <div key={option.value} className="relative">
              <RadioGroupItem 
                value={option.value} 
                id={`interaction-${option.value}`}
                className="absolute opacity-0"
              />
              <Label
                htmlFor={`interaction-${option.value}`}
                className={`block rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                  data.interactionMode === option.value 
                    ? `${isDark ? 'bg-indigo-950/50 border-indigo-500' : 'bg-indigo-50 border-indigo-500'}`
                    : `${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300'}`
                }`}
              >
                <div className="font-medium mb-1">{option.label}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center">
            <FileText className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Output Detail
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  How detailed you want the system's responses to be
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Select your preferred level of detail
          </p>
          
          <RadioGroup 
            value={data.outputDetail}
            onValueChange={(value) => updateData({ outputDetail: value })}
            className="space-y-3"
          >
            {outputDetailOptions.map(option => (
              <div key={option.value} className="relative">
                <RadioGroupItem 
                  value={option.value} 
                  id={`detail-${option.value}`}
                  className="absolute opacity-0"
                />
                <Label
                  htmlFor={`detail-${option.value}`}
                  className={`block rounded-lg border-2 p-3 cursor-pointer transition-colors ${
                    data.outputDetail === option.value 
                      ? `${isDark ? 'bg-indigo-950/50 border-indigo-500' : 'bg-indigo-50 border-indigo-500'}`
                      : `${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300'}`
                  }`}
                >
                  <div className="font-medium mb-1">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center">
            <Bot className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              System Behavior
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  How actively the system engages during your content creation
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Choose how the system should behave
          </p>
          
          <RadioGroup 
            value={data.systemBehavior}
            onValueChange={(value) => updateData({ systemBehavior: value })}
            className="space-y-3"
          >
            {systemBehaviorOptions.map(option => (
              <div key={option.value} className="relative">
                <RadioGroupItem 
                  value={option.value} 
                  id={`behavior-${option.value}`}
                  className="absolute opacity-0"
                />
                <Label
                  htmlFor={`behavior-${option.value}`}
                  className={`block rounded-lg border-2 p-3 cursor-pointer transition-colors ${
                    data.systemBehavior === option.value 
                      ? `${isDark ? 'bg-indigo-950/50 border-indigo-500' : 'bg-indigo-50 border-indigo-500'}`
                      : `${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300'}`
                  }`}
                >
                  <div className="font-medium mb-1">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
