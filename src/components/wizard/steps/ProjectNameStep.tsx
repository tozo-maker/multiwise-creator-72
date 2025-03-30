
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectNameStepProps {
  data: {
    name: string;
    quickStart: string;
  };
  updateData: (data: { name: string; quickStart: string }) => void;
}

export const ProjectNameStep: React.FC<ProjectNameStepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input 
          id="projectName" 
          value={data.name} 
          onChange={(e) => updateData({ ...data, name: e.target.value })}
          placeholder="Enter project name"
          className="w-full"
        />
      </div>
      
      <div className="space-y-3">
        <Label>Starting Point</Label>
        <RadioGroup 
          value={data.quickStart}
          onValueChange={(value) => updateData({ ...data, quickStart: value })}
          className="grid grid-cols-1 gap-4"
        >
          <Card className="border-2 border-brand-100 p-0 cursor-pointer">
            <CardContent className="p-0">
              <label className="flex items-start space-x-3 p-4 cursor-pointer">
                <RadioGroupItem value="template" id="template" className="mt-1" />
                <div>
                  <p className="font-medium">Start with a Template</p>
                  <p className="text-sm text-slate-500">
                    Choose from pre-configured templates for common educational materials.
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-brand-200 p-0 cursor-pointer">
            <CardContent className="p-0">
              <label className="flex items-start space-x-3 p-4 cursor-pointer">
                <RadioGroupItem value="custom" id="custom" className="mt-1" />
                <div>
                  <p className="font-medium">Custom Configuration</p>
                  <p className="text-sm text-slate-500">
                    Configure your project from scratch with full control over all settings.
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-brand-100 p-0 cursor-pointer">
            <CardContent className="p-0">
              <label className="flex items-start space-x-3 p-4 cursor-pointer">
                <RadioGroupItem value="duplicate" id="duplicate" className="mt-1" />
                <div>
                  <p className="font-medium">Duplicate Existing Project</p>
                  <p className="text-sm text-slate-500">
                    Clone an existing project as a starting point.
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>
        </RadioGroup>
      </div>
    </div>
  );
};
