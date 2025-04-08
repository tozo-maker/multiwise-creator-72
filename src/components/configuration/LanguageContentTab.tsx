
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ConfigData } from '@/components/wizard/types';
import { TooltipLabel } from './ui/TooltipLabel';

interface LanguageContentTabProps {
  configData: ConfigData;
  updateConfigData: (data: Partial<ConfigData>) => void;
}

export const LanguageContentTab: React.FC<LanguageContentTabProps> = ({ configData, updateConfigData }) => {
  return (
    <div className="space-y-8">
      <p className="mb-6">Configure language settings and content specifications.</p>
      
      <div className="space-y-2">
        <TooltipLabel
          htmlFor="targetLanguage"
          label="Target Language"
          tooltip="The language being taught or used in the content"
        />
        <Select 
          defaultValue={configData.targetLanguage}
          onValueChange={(value) => updateConfigData({ targetLanguage: value })}
        >
          <SelectTrigger id="targetLanguage" className="w-full">
            <SelectValue placeholder="Select target language" />
          </SelectTrigger>
          <SelectContent>
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
        <TooltipLabel
          htmlFor="goal"
          label="Content Goal"
          tooltip="Primary purpose of the content"
        />
        <Select 
          defaultValue={configData.goal}
          onValueChange={(value) => updateConfigData({ goal: value })}
        >
          <SelectTrigger id="goal" className="w-full">
            <SelectValue placeholder="Select content goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Teaching">Teaching</SelectItem>
            <SelectItem value="Practice">Practice</SelectItem>
            <SelectItem value="Reference">Reference</SelectItem>
            <SelectItem value="Assessment">Assessment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <TooltipLabel
          label="Complexity Level"
          tooltip="Difficulty level of the content"
        />
        <RadioGroup 
          defaultValue={configData.complexity}
          onValueChange={(value) => updateConfigData({ complexity: value })}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2"
        >
          <div className="flex items-center space-x-2 bg-card border border-border rounded-md p-3 hover:border-accent transition-colors cursor-pointer">
            <RadioGroupItem value="Beginner" id="complexity-beginner" />
            <Label htmlFor="complexity-beginner" className="cursor-pointer">Beginner</Label>
          </div>
          
          <div className="flex items-center space-x-2 bg-card border border-border rounded-md p-3 hover:border-accent transition-colors cursor-pointer">
            <RadioGroupItem value="Intermediate" id="complexity-intermediate" />
            <Label htmlFor="complexity-intermediate" className="cursor-pointer">Intermediate</Label>
          </div>
          
          <div className="flex items-center space-x-2 bg-card border border-border rounded-md p-3 hover:border-accent transition-colors cursor-pointer">
            <RadioGroupItem value="Advanced" id="complexity-advanced" />
            <Label htmlFor="complexity-advanced" className="cursor-pointer">Advanced</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <TooltipLabel
          htmlFor="culturalIntegration"
          label="Cultural Integration"
          tooltip="How much cultural context to include"
        />
        <Select 
          defaultValue={configData.culturalIntegration}
          onValueChange={(value) => updateConfigData({ culturalIntegration: value })}
        >
          <SelectTrigger id="culturalIntegration" className="w-full">
            <SelectValue placeholder="Select cultural integration level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Minimal">Minimal - Focus on language only</SelectItem>
            <SelectItem value="Moderate">Moderate - Some cultural context</SelectItem>
            <SelectItem value="Extensive">Extensive - Deep cultural integration</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
