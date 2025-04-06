
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
              {/* Using proper onClick handler instead of directly clicking on Label */}
              <div
                className={`
                  flex flex-col items-center p-4 rounded-md border cursor-pointer
                  ${data.goal === 'Teaching' 
                    ? 'bg-brand-50 border-brand-500' 
                    : 'border-slate-200 hover:bg-slate-50'
                  }
                `}
                onClick={() => updateData({ goal: 'Teaching' })}
              >
                <RadioGroupItem value="Teaching" id="goal-Teaching" className="sr-only" />
                <Label htmlFor="goal-Teaching" className="cursor-pointer text-center">
                  <div className="font-medium">Content Delivery</div>
                  <div className="text-xs text-muted-foreground mt-1">Focus on delivering educational content</div>
                </Label>
              </div>
              
              <div
                className={`
                  flex flex-col items-center p-4 rounded-md border cursor-pointer
                  ${data.goal === 'Cultural' 
                    ? 'bg-brand-50 border-brand-500' 
                    : 'border-slate-200 hover:bg-slate-50'
                  }
                `}
                onClick={() => updateData({ goal: 'Cultural' })}
              >
                <RadioGroupItem value="Cultural" id="goal-Cultural" className="sr-only" />
                <Label htmlFor="goal-Cultural" className="cursor-pointer text-center">
                  <div className="font-medium">Cultural Education</div>
                  <div className="text-xs text-muted-foreground mt-1">Emphasize cultural context and nuances</div>
                </Label>
              </div>
              
              <div
                className={`
                  flex flex-col items-center p-4 rounded-md border cursor-pointer
                  ${data.goal === 'Balanced' 
                    ? 'bg-brand-50 border-brand-500' 
                    : 'border-slate-200 hover:bg-slate-50'
                  }
                `}
                onClick={() => updateData({ goal: 'Balanced' })}
              >
                <RadioGroupItem value="Balanced" id="goal-Balanced" className="sr-only" />
                <Label htmlFor="goal-Balanced" className="cursor-pointer text-center">
                  <div className="font-medium">Balanced</div>
                  <div className="text-xs text-muted-foreground mt-1">Equal focus on content and cultural elements</div>
                </Label>
              </div>
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
              {/* Fixed complexity options */}
              {['Basic', 'Elementary', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                <div
                  key={level}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-md border cursor-pointer
                    transition-all duration-200 hover:border-brand-300 hover:bg-brand-50
                    ${data.complexity === level ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}
                  `}
                  onClick={() => updateData({ complexity: level })}
                >
                  <RadioGroupItem value={level} id={`complexity-${level}`} className="sr-only" />
                  <Label htmlFor={`complexity-${level}`} className="cursor-pointer text-center">
                    <span className="font-medium text-sm">{level}</span>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {level === 'Basic' && "Simple vocabulary and grammar"}
                      {level === 'Elementary' && "Foundational language"}
                      {level === 'Intermediate' && "Moderate complexity"}
                      {level === 'Advanced' && "Complex language"}
                      {level === 'Expert' && "Sophisticated language"}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            {/* AI-Adapted option outside the grid */}
            <RadioGroup value={data.complexity === 'AI-Adapted' ? 'AI-Adapted' : ''} onValueChange={(value) => {
              if (value) updateData({ complexity: value });
            }} className="mt-2">
              <div
                className={`
                  flex flex-col items-center justify-center p-3 rounded-md border cursor-pointer
                  transition-all duration-200 hover:border-brand-300 hover:bg-brand-50
                  ${data.complexity === 'AI-Adapted' ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}
                `}
                onClick={() => updateData({ complexity: 'AI-Adapted' })}
              >
                <RadioGroupItem value="AI-Adapted" id="complexity-AI-Adapted" className="sr-only" />
                <Label htmlFor="complexity-AI-Adapted" className="cursor-pointer text-center">
                  <span className="font-medium text-sm">AI-Adapted</span>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    Automatically adjusted based on context and subject
                  </span>
                </Label>
              </div>
            </RadioGroup>
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
