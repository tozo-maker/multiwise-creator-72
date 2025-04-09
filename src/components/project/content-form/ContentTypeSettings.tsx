
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentType, EducationalLevel } from '@/components/project/ContentCreationForm';
import { useTheme } from '@/contexts/ThemeContext';

export interface ContentTypeSettingsProps {
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
  targetLevel: EducationalLevel;
  setTargetLevel: (level: EducationalLevel) => void;
}

export const ContentTypeSettings: React.FC<ContentTypeSettingsProps> = ({
  contentType,
  setContentType,
  targetLevel,
  setTargetLevel
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="space-y-4">
      <div>
        <Label className={`block mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Content Type
        </Label>
        <RadioGroup 
          value={contentType} 
          onValueChange={(value) => setContentType(value as ContentType)}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lesson" id="lesson" />
            <Label htmlFor="lesson" className="cursor-pointer">Lesson</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="quiz" id="quiz" />
            <Label htmlFor="quiz" className="cursor-pointer">Quiz</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="activity" id="activity" />
            <Label htmlFor="activity" className="cursor-pointer">Activity</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="assessment" id="assessment" />
            <Label htmlFor="assessment" className="cursor-pointer">Assessment</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="summary" id="summary" />
            <Label htmlFor="summary" className="cursor-pointer">Summary</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="targetLevel" className={`block mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Target Education Level
        </Label>
        <Select 
          value={targetLevel}
          onValueChange={(value) => setTargetLevel(value as EducationalLevel)}
        >
          <SelectTrigger id="targetLevel" className="w-full">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="elementary">Elementary School</SelectItem>
            <SelectItem value="middle">Middle School</SelectItem>
            <SelectItem value="high">High School</SelectItem>
            <SelectItem value="college">College/University</SelectItem>
            <SelectItem value="professional">Professional/Adult Education</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ContentTypeSettings;
