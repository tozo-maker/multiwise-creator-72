
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProjectData } from '../hooks/useProjectWizard';

interface ProjectBasicsStepProps {
  data: ProjectData;
  updateData: (data: Partial<ProjectData>) => void;
}

export function ProjectBasicsStep({ data, updateData }: ProjectBasicsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="project-name" className="text-base">Project Name</Label>
          <Input
            id="project-name"
            placeholder="Enter project name"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            className="w-full"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="project-description" className="text-base">Description</Label>
          <Textarea
            id="project-description"
            placeholder="Describe your project (optional)"
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            className="w-full min-h-24"
          />
        </div>
      </div>
    </div>
  );
}
