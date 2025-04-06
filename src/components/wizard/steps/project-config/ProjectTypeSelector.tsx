
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProjectTypeSelectorProps {
  projectType: string;
  customProjectType?: string;
  onProjectTypeChange: (value: string) => void;
  onCustomProjectTypeChange: (value: string) => void;
}

export const ProjectTypeSelector: React.FC<ProjectTypeSelectorProps> = ({
  projectType,
  customProjectType = '',
  onProjectTypeChange,
  onCustomProjectTypeChange
}) => {
  const [localCustomValue, setLocalCustomValue] = useState(customProjectType || '');
  
  useEffect(() => {
    if (projectType === 'Custom' && !customProjectType) {
      onCustomProjectTypeChange('');
    }
  }, [projectType, customProjectType, onCustomProjectTypeChange]);

  const handleProjectTypeChange = (value: string) => {
    onProjectTypeChange(value);
  };

  const handleCustomProjectTypeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalCustomValue(value);
    onCustomProjectTypeChange(value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="projectType">Project Type</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-slate-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-80">The type of educational material you want to create</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select 
        value={projectType} 
        onValueChange={handleProjectTypeChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select project type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Textbook">Textbook</SelectItem>
          <SelectItem value="Lesson-Plan">Lesson Plan</SelectItem>
          <SelectItem value="Workbook">Workbook</SelectItem>
          <SelectItem value="Teacher-Guide">Teacher Guide</SelectItem>
          <SelectItem value="Assessment">Assessment</SelectItem>
          <SelectItem value="Curriculum">Full Curriculum</SelectItem>
          <SelectItem value="Course">Online Course</SelectItem>
          <SelectItem value="Tutorial">Tutorial</SelectItem>
          <SelectItem value="Custom">Custom</SelectItem>
        </SelectContent>
      </Select>
      
      {projectType === 'Custom' && (
        <div className="mt-2">
          <Label htmlFor="customProjectType" className="text-sm">Specify Custom Project Type</Label>
          <Textarea 
            id="customProjectType"
            placeholder="Describe your custom project type..."
            value={localCustomValue}
            onChange={handleCustomProjectTypeChange}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
};
