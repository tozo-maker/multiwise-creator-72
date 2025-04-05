
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProjectTypeSelectorProps {
  projectType: string;
  onProjectTypeChange: (value: string) => void;
}

export const ProjectTypeSelector: React.FC<ProjectTypeSelectorProps> = ({
  projectType,
  onProjectTypeChange
}) => {
  const [customProjectType, setCustomProjectType] = useState('');

  const handleProjectTypeChange = (value: string) => {
    onProjectTypeChange(value);
  };

  const handleCustomProjectTypeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomProjectType(e.target.value);
    onProjectTypeChange('Custom: ' + e.target.value);
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
        value={projectType.startsWith('Custom:') ? 'Custom' : projectType} 
        onValueChange={handleProjectTypeChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select project type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Textbook">Textbook</SelectItem>
          <SelectItem value="Lesson Plan">Lesson Plan</SelectItem>
          <SelectItem value="Workbook">Workbook</SelectItem>
          <SelectItem value="Teacher Guide">Teacher Guide</SelectItem>
          <SelectItem value="Assessment">Assessment</SelectItem>
          <SelectItem value="Custom">Custom</SelectItem>
        </SelectContent>
      </Select>
      
      {projectType === 'Custom' || projectType.startsWith('Custom:') ? (
        <div className="mt-2">
          <Label htmlFor="customProjectType" className="text-sm">Specify Custom Project Type</Label>
          <Textarea 
            id="customProjectType"
            placeholder="Describe your custom project type..."
            value={customProjectType}
            onChange={handleCustomProjectTypeChange}
            className="mt-1"
          />
        </div>
      ) : null}
    </div>
  );
};
