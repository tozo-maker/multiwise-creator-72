
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectConfigStepProps {
  data: {
    name: string;
    description: string;
    type: string;
    language: string;
    targetAudience: string;
    complexity: string;
    templateId: string;
  };
  updateData: (data: Partial<typeof ProjectConfigStepProps['data']>) => void;
  isMobile?: boolean;
}

export function ProjectConfigStep({ data, updateData, isMobile = false }: ProjectConfigStepProps) {
  const projectTypes = [
    { value: 'course', label: 'Course' },
    { value: 'lesson', label: 'Lesson Plan' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'presentation', label: 'Presentation' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-slate-900 dark:text-slate-200">Project Type</Label>
        <RadioGroup 
          value={data.type} 
          onValueChange={(value) => updateData({ type: value })}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {projectTypes.map((type) => (
            <Card 
              key={type.value}
              className={`border ${data.type === type.value ? 'border-primary dark:border-primary' : 'border-slate-200 dark:border-slate-700'} 
                bg-white dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors cursor-pointer`}
              onClick={() => updateData({ type: type.value })}
            >
              <CardContent className="p-4 flex items-center space-x-3">
                <RadioGroupItem value={type.value} id={`type-${type.value}`} />
                <Label 
                  htmlFor={`type-${type.value}`} 
                  className="font-medium text-slate-900 dark:text-slate-200 cursor-pointer"
                >
                  {type.label}
                </Label>
              </CardContent>
            </Card>
          ))}
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="custom-type" className="text-slate-900 dark:text-slate-200">Custom Type (Optional)</Label>
        <Input
          id="custom-type"
          placeholder="Enter custom project type"
          value={data.type && !projectTypes.some(t => t.value === data.type) ? data.type : ''}
          onChange={(e) => updateData({ type: e.target.value })}
          className="mt-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
        />
      </div>
      
      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
        <h3 className="text-md font-medium text-slate-900 dark:text-slate-100 mb-3">Additional Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimated-length" className="text-slate-900 dark:text-slate-200">Estimated Length</Label>
            <Select
              onValueChange={(value) => updateData({ /* Store this in your data structure if needed */ })}
              defaultValue="medium"
            >
              <SelectTrigger 
                id="estimated-length"
                className="border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              >
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (< 1 hour)</SelectItem>
                <SelectItem value="medium">Medium (1-3 hours)</SelectItem>
                <SelectItem value="long">Long (3+ hours)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="format" className="text-slate-900 dark:text-slate-200">Format</Label>
            <Select
              onValueChange={(value) => updateData({ /* Store this in your data structure if needed */ })}
              defaultValue="text"
            >
              <SelectTrigger 
                id="format"
                className="border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              >
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="presentation">Presentation</SelectItem>
                <SelectItem value="interactive">Interactive</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
