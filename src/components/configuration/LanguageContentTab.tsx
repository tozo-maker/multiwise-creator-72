
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ConfigData } from '@/components/wizard/types';

interface LanguageContentTabProps {
  configData: ConfigData;
  updateConfigData: (data: Partial<ConfigData>) => void;
}

export const LanguageContentTab: React.FC<LanguageContentTabProps> = ({ configData, updateConfigData }) => {
  return (
    <div className="text-slate-300 space-y-8">
      <p className="mb-6">Configure language settings and content specifications.</p>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="targetLanguage" className="text-slate-300">Target Language</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>The language being taught or used in the content</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          defaultValue={configData.targetLanguage}
          onValueChange={(value) => updateConfigData({ targetLanguage: value })}
        >
          <SelectTrigger id="targetLanguage" className="bg-slate-800 border-slate-600 text-slate-200 w-full">
            <SelectValue placeholder="Select target language" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Mandarin">Mandarin Chinese</SelectItem>
            <SelectItem value="Japanese">Japanese</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="goal" className="text-slate-300">Content Goal</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Primary purpose of the content</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          defaultValue={configData.goal}
          onValueChange={(value) => updateConfigData({ goal: value })}
        >
          <SelectTrigger id="goal" className="bg-slate-800 border-slate-600 text-slate-200 w-full">
            <SelectValue placeholder="Select content goal" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
            <SelectItem value="Teaching">Teaching</SelectItem>
            <SelectItem value="Practice">Practice</SelectItem>
            <SelectItem value="Reference">Reference</SelectItem>
            <SelectItem value="Assessment">Assessment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-slate-300">Complexity Level</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Difficulty level of the content</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <RadioGroup 
          defaultValue={configData.complexity}
          onValueChange={(value) => updateConfigData({ complexity: value })}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2"
        >
          <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 rounded-md p-3 hover:border-slate-600 transition-colors cursor-pointer">
            <RadioGroupItem value="Beginner" id="complexity-beginner" />
            <Label htmlFor="complexity-beginner" className="cursor-pointer">Beginner</Label>
          </div>
          
          <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 rounded-md p-3 hover:border-slate-600 transition-colors cursor-pointer">
            <RadioGroupItem value="Intermediate" id="complexity-intermediate" />
            <Label htmlFor="complexity-intermediate" className="cursor-pointer">Intermediate</Label>
          </div>
          
          <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 rounded-md p-3 hover:border-slate-600 transition-colors cursor-pointer">
            <RadioGroupItem value="Advanced" id="complexity-advanced" />
            <Label htmlFor="complexity-advanced" className="cursor-pointer">Advanced</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="culturalIntegration" className="text-slate-300">Cultural Integration</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>How much cultural context to include</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          defaultValue={configData.culturalIntegration}
          onValueChange={(value) => updateConfigData({ culturalIntegration: value })}
        >
          <SelectTrigger id="culturalIntegration" className="bg-slate-800 border-slate-600 text-slate-200 w-full">
            <SelectValue placeholder="Select cultural integration level" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
            <SelectItem value="Minimal">Minimal - Focus on language only</SelectItem>
            <SelectItem value="Moderate">Moderate - Some cultural context</SelectItem>
            <SelectItem value="Extensive">Extensive - Deep cultural integration</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
