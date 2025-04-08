
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  FileText, 
  PenTool, 
  Video, 
  FileQuestion,
  Presentation
} from 'lucide-react';

interface ProjectConfigStepProps {
  data: {
    type: string;
  };
  updateData: (data: Partial<typeof data>) => void;
  isMobile?: boolean;
}

export function ProjectConfigStep({ data, updateData, isMobile = false }: ProjectConfigStepProps) {
  const projectTypes = [
    { value: 'textbook', label: 'Textbook', icon: BookOpen, description: 'Comprehensive educational material with chapters' },
    { value: 'worksheet', label: 'Worksheets', icon: FileText, description: 'Practice exercises and problems' },
    { value: 'lesson', label: 'Lesson Plans', icon: PenTool, description: 'Structured teaching guides' },
    { value: 'presentation', label: 'Presentation', icon: Presentation, description: 'Slides and visual aids' },
    { value: 'assessment', label: 'Assessment', icon: FileQuestion, description: 'Tests, quizzes, and evaluations' },
    { value: 'multimedia', label: 'Multimedia', icon: Video, description: 'Scripts for videos and interactive content' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Project Type</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Choose the type of educational content you want to create
        </p>
      </div>
      
      <RadioGroup 
        value={data.type} 
        onValueChange={(value) => updateData({ type: value })}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {projectTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div key={type.value} className="relative">
              <RadioGroupItem
                value={type.value}
                id={type.value}
                className="sr-only"
              />
              <Label
                htmlFor={type.value}
                className={`flex flex-col h-full p-4 rounded-lg border cursor-pointer transition-all ${
                  data.type === type.value
                    ? "border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-950/40"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 p-1.5 rounded-md ${
                    data.type === type.value
                      ? "bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className={`font-medium ${
                      data.type === type.value
                        ? "text-brand-700 dark:text-brand-400"
                        : "text-slate-900 dark:text-slate-100"
                    }`}>{type.label}</div>
                    <div className={`text-xs mt-1 ${
                      data.type === type.value
                        ? "text-brand-600 dark:text-brand-300"
                        : "text-slate-500 dark:text-slate-400"
                    }`}>{type.description}</div>
                  </div>
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      
      {data.type === 'custom' && (
        <div className="space-y-2 mt-4">
          <Label htmlFor="customType" className="text-slate-900 dark:text-slate-100">Custom Type</Label>
          <Input
            id="customType"
            placeholder="Specify your project type"
            className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            onChange={(e) => updateData({ type: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}
