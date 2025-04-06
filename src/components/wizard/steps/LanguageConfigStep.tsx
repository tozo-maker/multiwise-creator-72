
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StandardsSelector } from './language-config/StandardsSelector';
import { ConfigData } from '../types';

interface LanguageConfigProps {
  data: Pick<ConfigData, 
    'targetLanguage' | 
    'goal' | 
    'complexity' | 
    'culturalIntegration' | 
    'terminology' | 
    'markers' |
    'standards' |
    'customStandards' |
    'structure' |
    'formatting' |
    'scriptType'
  >;
  updateData: (data: Partial<ConfigData>) => void;
}

export const LanguageConfigStep: React.FC<LanguageConfigProps> = ({ data, updateData }) => {
  const languages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 
    'Arabic', 'Russian', 'Portuguese', 'Hindi', 'Korean', 'Italian'
  ];

  return (
    <div className="space-y-6">
      {/* Content Language */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="targetLanguage" className="text-base font-medium">Content Language</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">The primary language in which your educational content will be created</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Select value={data.targetLanguage} onValueChange={(value) => updateData({ targetLanguage: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            {data.targetLanguage === 'Other' && (
              <Textarea 
                placeholder="Specify the content language"
                className="mt-2"
                onChange={(e) => updateData({ targetLanguage: `Other: ${e.target.value}` })}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Script Type - Adding the missing field */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="scriptType" className="text-base font-medium">Script Type</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">The writing system used for the content language</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Select value={data.scriptType} onValueChange={(value) => updateData({ scriptType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select script type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Latin">Latin</SelectItem>
                <SelectItem value="Cyrillic">Cyrillic</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
                <SelectItem value="Chinese">Chinese (Hanzi)</SelectItem>
                <SelectItem value="Japanese">Japanese (Kanji & Kana)</SelectItem>
                <SelectItem value="Korean">Korean (Hangul)</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Language Goal */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">Content Language Goal</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">How you intend to use the language in your content</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <RadioGroup 
              value={data.goal}
              onValueChange={(value) => updateData({ goal: value })}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <OptionCard
                value="Teaching"
                label="Content Delivery"
                description="Focus on delivering educational content"
                isSelected={data.goal === 'Teaching'}
              />
              <OptionCard
                value="Cultural"
                label="Cultural Education"
                description="Emphasize cultural context and nuances"
                isSelected={data.goal === 'Cultural'}
              />
              <OptionCard
                value="Balanced"
                label="Balanced"
                description="Equal focus on content and cultural elements"
                isSelected={data.goal === 'Balanced'}
              />
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Content Language Complexity */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">Content Language Complexity</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">The linguistic complexity level for the generated content</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <RadioGroup 
              value={data.complexity}
              onValueChange={(value) => updateData({ complexity: value })}
              className="grid grid-cols-1 sm:grid-cols-5 gap-2"
            >
              <OptionCard
                value="Basic"
                label="Basic"
                description="Simple vocabulary and grammar"
                isSelected={data.complexity === 'Basic'}
              />
              <OptionCard
                value="Elementary"
                label="Elementary"
                description="Foundational language"
                isSelected={data.complexity === 'Elementary'}
              />
              <OptionCard
                value="Intermediate"
                label="Intermediate"
                description="Moderate complexity"
                isSelected={data.complexity === 'Intermediate'}
              />
              <OptionCard
                value="Advanced"
                label="Advanced"
                description="Complex language"
                isSelected={data.complexity === 'Advanced'}
              />
              <OptionCard
                value="Expert"
                label="Expert"
                description="Sophisticated language"
                isSelected={data.complexity === 'Expert'}
              />
            </RadioGroup>
            
            <OptionCard
              value="AI-Adapted"
              label="AI-Adapted"
              description="Automatically adjusted based on context and subject"
              isSelected={data.complexity === 'AI-Adapted'}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Standards Alignment */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <StandardsSelector
            standards={data.standards || []}
            customStandards={data.customStandards || []}
            onStandardsChange={(standards) => updateData({ standards })}
            onCustomStandardsChange={(customStandards) => updateData({ customStandards })}
          />
        </CardContent>
      </Card>

      {/* Additional Language Settings */}
      <Card className="border-slate-200">
        <CardContent className="pt-6 space-y-6">
          {/* Cultural Integration */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">Cultural Integration</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">How much cultural context to include in the content</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Select value={data.culturalIntegration} onValueChange={(value) => updateData({ culturalIntegration: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select cultural integration level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Minimal">Minimal</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Enhanced">Enhanced</SelectItem>
                <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                <SelectItem value="Progressive">Progressive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Terminology Approach */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">Terminology Approach</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">How to handle terminology across languages</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Select value={data.terminology} onValueChange={(value) => updateData({ terminology: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select terminology approach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Content-Language">Prioritize Content Language</SelectItem>
                <SelectItem value="International">Preserve International Terms</SelectItem>
                <SelectItem value="Dual">Dual Terminology (Both)</SelectItem>
                <SelectItem value="Context-Sensitive">Context Sensitive</SelectItem>
                <SelectItem value="Frequency-Based">Frequency Based</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Educational Level Markers */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">Educational Level Markers</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">How educational levels are indicated in the content</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Select value={data.markers} onValueChange={(value) => updateData({ markers: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select marker style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Visible">Visible Markers</SelectItem>
                <SelectItem value="Headings">Headings</SelectItem>
                <SelectItem value="Sections">Sections</SelectItem>
                <SelectItem value="Implicit">Implicit</SelectItem>
                <SelectItem value="Visual">Visual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Content Structure */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">Content Structure</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">How content should be structured and organized</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Select value={data.structure} onValueChange={(value) => updateData({ structure: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select content structure" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fixed">Fixed</SelectItem>
                <SelectItem value="Variable">Variable</SelectItem>
                <SelectItem value="Traditional">Traditional Academic</SelectItem>
                <SelectItem value="Teaching">Teaching-focused</SelectItem>
                <SelectItem value="Activity">Activity-centered</SelectItem>
                <SelectItem value="Progressive">Topic-Progressive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component for radio options
const OptionCard = ({ value, label, description, isSelected, className = '' }: { 
  value: string;
  label: string;
  description: string;
  isSelected: boolean;
  className?: string;
}) => {
  return (
    <Label
      htmlFor={value}
      className={`
        flex flex-col items-center justify-center p-3 rounded-md border cursor-pointer
        transition-all duration-200 hover:border-brand-300 hover:bg-brand-50
        ${isSelected ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}
        ${className}
      `}
    >
      <RadioGroupItem value={value} id={value} className="sr-only" />
      <span className="font-medium text-sm">{label}</span>
      <span className="text-xs text-muted-foreground mt-1 text-center">{description}</span>
    </Label>
  );
};
