
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { ConfigData } from '../types';

interface SystemConfigProps {
  data: Pick<ConfigData, 
    'interfaceLanguage' | 
    'experienceLevel' | 
    'interactionMode' | 
    'outputDetail' | 
    'systemBehavior'
  >;
  updateData: (data: Partial<ConfigData>) => void;
}

export const SystemConfigStep: React.FC<SystemConfigProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-8">
      {/* Interface Language */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="interfaceLanguage" className="text-base font-medium">Interface Language</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">The language used for the MultiGuide interface itself, not the content you're creating</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <RadioGroup
          value={data.interfaceLanguage}
          onValueChange={(value) => updateData({ interfaceLanguage: value })}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2"
        >
          <OptionCard
            value="English"
            label="English"
            description="English interface"
            isSelected={data.interfaceLanguage === 'English'}
          />
          <OptionCard
            value="Bilingual"
            label="Bilingual"
            description="English + Content Language"
            isSelected={data.interfaceLanguage === 'Bilingual'}
          />
          <OptionCard
            value="Other"
            label="Other"
            description="Other supported language"
            isSelected={data.interfaceLanguage === 'Other'}
          />
        </RadioGroup>
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="experienceLevel" className="text-base font-medium">Experience Level</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">This helps tailor guidance and interface complexity to your comfort level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <RadioGroup
          value={data.experienceLevel}
          onValueChange={(value) => updateData({ experienceLevel: value })}
          className="grid grid-cols-1 sm:grid-cols-4 gap-2"
        >
          <OptionCard
            value="Beginner"
            label="Beginner"
            description="Extra guidance"
            isSelected={data.experienceLevel === 'Beginner'}
          />
          <OptionCard
            value="Intermediate"
            label="Intermediate"
            description="Standard help"
            isSelected={data.experienceLevel === 'Intermediate'}
          />
          <OptionCard
            value="Advanced"
            label="Advanced"
            description="Minimal guidance"
            isSelected={data.experienceLevel === 'Advanced'}
          />
          <OptionCard
            value="Expert"
            label="Expert"
            description="Technical focus"
            isSelected={data.experienceLevel === 'Expert'}
          />
        </RadioGroup>
      </div>

      {/* Interaction Mode */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="interactionMode" className="text-base font-medium">Interaction Mode</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">How you prefer to interact with the system</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <RadioGroup
          value={data.interactionMode}
          onValueChange={(value) => updateData({ interactionMode: value })}
          className="grid grid-cols-1 sm:grid-cols-4 gap-2"
        >
          <OptionCard
            value="Command"
            label="Command"
            description="Direct instructions"
            isSelected={data.interactionMode === 'Command'}
          />
          <OptionCard
            value="Conversational"
            label="Conversational"
            description="Natural dialogue"
            isSelected={data.interactionMode === 'Conversational'}
          />
          <OptionCard
            value="Guided"
            label="AI-assisted"
            description="AI suggestions"
            isSelected={data.interactionMode === 'Guided'}
          />
          <OptionCard
            value="Hybrid"
            label="Hybrid"
            description="Mixed approach"
            isSelected={data.interactionMode === 'Hybrid'}
          />
        </RadioGroup>
      </div>

      {/* Output Detail Level */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="outputDetail" className="text-base font-medium">Output Detail Level</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">How comprehensive you want the system's responses to be</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <RadioGroup
          value={data.outputDetail}
          onValueChange={(value) => updateData({ outputDetail: value })}
          className="grid grid-cols-1 sm:grid-cols-4 gap-2"
        >
          <OptionCard
            value="Concise"
            label="Concise"
            description="Brief answers"
            isSelected={data.outputDetail === 'Concise'}
          />
          <OptionCard
            value="Balanced"
            label="Balanced"
            description="Moderate detail"
            isSelected={data.outputDetail === 'Balanced'}
          />
          <OptionCard
            value="Detailed"
            label="Comprehensive"
            description="Full explanations"
            isSelected={data.outputDetail === 'Detailed'}
          />
          <OptionCard
            value="Progressive"
            label="Progressive"
            description="Adapts as you go"
            isSelected={data.outputDetail === 'Progressive'}
          />
        </RadioGroup>
      </div>

      {/* System Behavior */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="systemBehavior" className="text-base font-medium">System Behavior</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">The overall approach the system takes when working with you</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <RadioGroup
          value={data.systemBehavior}
          onValueChange={(value) => updateData({ systemBehavior: value })}
          className="grid grid-cols-1 sm:grid-cols-4 gap-2"
        >
          <OptionCard
            value="Reactive"
            label="Reactive"
            description="Responds to requests"
            isSelected={data.systemBehavior === 'Reactive'}
          />
          <OptionCard
            value="Collaborative"
            label="Collaborative"
            description="Works with you"
            isSelected={data.systemBehavior === 'Collaborative'}
          />
          <OptionCard
            value="Analytical"
            label="Analytical"
            description="Focuses on details"
            isSelected={data.systemBehavior === 'Analytical'}
          />
          <OptionCard
            value="Predictive"
            label="Predictive"
            description="Anticipates needs"
            isSelected={data.systemBehavior === 'Predictive'}
          />
        </RadioGroup>
      </div>
    </div>
  );
};

// Helper component for radio options
const OptionCard = ({ value, label, description, isSelected }: { 
  value: string;
  label: string;
  description: string;
  isSelected: boolean;
}) => {
  return (
    <Label
      htmlFor={value}
      className={`
        flex flex-col items-center justify-center p-3 rounded-md border cursor-pointer
        transition-all duration-200 hover:border-brand-300 hover:bg-brand-50
        ${isSelected ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}
      `}
    >
      <RadioGroupItem value={value} id={value} className="sr-only" />
      <span className="font-medium text-sm">{label}</span>
      <span className="text-xs text-muted-foreground mt-1 text-center">{description}</span>
    </Label>
  );
};
