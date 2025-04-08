
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectBasicsData {
  name: string;
  description: string;
  language: string;
  targetAudience: string;
  complexity: string;
}

interface ProjectBasicsStepProps {
  data: ProjectBasicsData;
  updateData: (data: Partial<ProjectBasicsData>) => void;
  isMobile?: boolean;
}

export function ProjectBasicsStep({ data, updateData, isMobile = false }: ProjectBasicsStepProps) {
  const languageOptions = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'];
  const complexityOptions = ['Beginner', 'Intermediate', 'Advanced', 'Mixed'];
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-900 dark:text-slate-100">Project Name</Label>
        <Input
          id="name"
          placeholder="Enter project name"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-slate-900 dark:text-slate-100">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your project"
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          className="min-h-[100px] border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="language" className="text-slate-900 dark:text-slate-100">Primary Language</Label>
          <Select
            value={data.language}
            onValueChange={(value) => updateData({ language: value })}
          >
            <SelectTrigger 
              id="language"
              className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map(lang => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="complexity" className="text-slate-900 dark:text-slate-100">Complexity Level</Label>
          <Select
            value={data.complexity}
            onValueChange={(value) => updateData({ complexity: value })}
          >
            <SelectTrigger 
              id="complexity"
              className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <SelectValue placeholder="Select complexity" />
            </SelectTrigger>
            <SelectContent>
              {complexityOptions.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="targetAudience" className="text-slate-900 dark:text-slate-100">Target Audience</Label>
        <Input
          id="targetAudience"
          placeholder="Who is this content for?"
          value={data.targetAudience}
          onChange={(e) => updateData({ targetAudience: e.target.value })}
          className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>
    </div>
  );
}
