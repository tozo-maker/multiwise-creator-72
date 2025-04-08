
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Languages, BookOpen, MessageSquare, Sparkles } from 'lucide-react';

interface LanguageConfigStepProps {
  data: {
    language: string;
    targetAudience: string;
    complexity: string;
    templateId: string;
  };
  updateData: (data: Partial<LanguageConfigStepProps['data']>) => void;
}

export function LanguageConfigStep({ data, updateData }: LanguageConfigStepProps) {
  const languages = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Arabic', label: 'Arabic' },
    { value: 'Portuguese', label: 'Portuguese' },
    { value: 'Russian', label: 'Russian' }
  ];
  
  const complexityLevels = ['Beginner', 'Intermediate', 'Advanced', 'Mixed'];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">Language Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Configure language and complexity settings for your educational content.
        </p>
      </div>
      
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Languages className="h-5 w-5 text-indigo-500" />
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Primary Language</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language" className="text-slate-700 dark:text-slate-300">
              Content Language
            </Label>
            <Select 
              value={data.language} 
              onValueChange={(value) => updateData({ language: value })}
            >
              <SelectTrigger 
                id="language" 
                className="border-slate-200 dark:border-slate-700 dark:bg-slate-800/50"
              >
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              This will be the primary language used for all generated content
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div>
              <Label htmlFor="multilingual" className="font-medium text-slate-700 dark:text-slate-300">
                Enable Multilingual Support
              </Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate content in multiple languages
              </p>
            </div>
            <Switch id="multilingual" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Complexity & Audience</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="text-slate-700 dark:text-slate-300">
                Target Audience
              </Label>
              <Select 
                value={data.targetAudience} 
                onValueChange={(value) => updateData({ targetAudience: value })}
              >
                <SelectTrigger 
                  id="targetAudience" 
                  className="border-slate-200 dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elementary">Elementary School</SelectItem>
                  <SelectItem value="middle">Middle School</SelectItem>
                  <SelectItem value="high">High School</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300">Complexity Level</Label>
              <RadioGroup 
                value={data.complexity} 
                onValueChange={(value) => updateData({ complexity: value })}
                className="flex flex-wrap gap-2 pt-2"
              >
                {complexityLevels.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={`complexity-${level}`} />
                    <Label htmlFor={`complexity-${level}`}>{level}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Content Style</h3>
          </div>
          
          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-slate-700 dark:text-slate-300">Formality</Label>
                <span className="text-xs text-slate-500 dark:text-slate-400">Balanced</span>
              </div>
              <Slider defaultValue={[50]} max={100} step={1} />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Casual</span>
                <span>Formal</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-slate-700 dark:text-slate-300">Technical Language</Label>
                <span className="text-xs text-slate-500 dark:text-slate-400">Moderate</span>
              </div>
              <Slider defaultValue={[60]} max={100} step={1} />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Simplified</span>
                <span>Technical</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
