
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContentTypeSettingsProps {
  contentType: string;
  setContentType: (value: string) => void;
  targetLevel: string;
  setTargetLevel: (value: string) => void;
}

export const ContentTypeSettings: React.FC<ContentTypeSettingsProps> = ({
  contentType,
  setContentType,
  targetLevel,
  setTargetLevel
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Content Type</Label>
        <Select value={contentType} onValueChange={setContentType}>
          <SelectTrigger>
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lesson">Lesson</SelectItem>
            <SelectItem value="exercise">Exercise</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="reference">Reference</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Target Level</Label>
        <Select value={targetLevel} onValueChange={setTargetLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Select target level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
