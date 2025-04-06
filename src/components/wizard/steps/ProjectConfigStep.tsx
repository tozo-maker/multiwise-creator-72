
import React, { useState } from 'react';
import { ProjectTypeSelector } from './project-config/ProjectTypeSelector';
import { SubjectSelector } from './project-config/SubjectSelector';
import { EducationalLevelSelector } from './project-config/EducationalLevelSelector';
import { PedagogySelector } from './project-config/PedagogySelector';
import { WordCountInput } from './project-config/WordCountInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProjectConfigProps {
  data: {
    projectType: string;
    customProjectType?: string;
    subjects: string[];
    levels: string[];
    pedagogy: string;
    wordCount: number;
    wordDistribution?: string;
    wordEnforcement?: string;
  };
  updateData: (data: Partial<{
    projectType: string;
    customProjectType?: string;
    subjects: string[];
    levels: string[];
    pedagogy: string;
    wordCount: number;
    wordDistribution?: string;
    wordEnforcement?: string;
  }>) => void;
}

export const ProjectConfigStep: React.FC<ProjectConfigProps> = ({ data, updateData }) => {
  const [showCustomProjectType, setShowCustomProjectType] = useState<boolean>(data.projectType === 'Custom');

  const handleProjectTypeChange = (value: string) => {
    const isCustom = value === 'Custom';
    setShowCustomProjectType(isCustom);
    updateData({ projectType: value });
  };

  return (
    <div className="space-y-8">
      {/* Project Type Section */}
      <div className="space-y-4">
        <ProjectTypeSelector 
          projectType={data.projectType} 
          onProjectTypeChange={handleProjectTypeChange} 
        />
        
        {showCustomProjectType && (
          <div className="space-y-2 ml-6">
            <Label htmlFor="customProjectType">Custom Project Type</Label>
            <Input
              id="customProjectType"
              value={data.customProjectType || ''}
              onChange={(e) => updateData({ customProjectType: e.target.value })}
              placeholder="Specify your custom project type"
              className="max-w-md"
            />
          </div>
        )}
      </div>

      {/* Two Column Layout for Subjects and Levels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SubjectSelector 
          subjects={data.subjects} 
          onSubjectsChange={(subjects) => updateData({ subjects })} 
        />
        
        <EducationalLevelSelector 
          levels={data.levels} 
          onLevelsChange={(levels) => updateData({ levels })} 
        />
      </div>
      
      {/* Pedagogy Selector */}
      <PedagogySelector 
        pedagogy={data.pedagogy} 
        onPedagogyChange={(value) => updateData({ pedagogy: value })} 
      />
      
      {/* Enhanced Word Count Settings */}
      <WordCountInput 
        wordCount={data.wordCount} 
        onWordCountChange={(value) => updateData({ wordCount: value })} 
        distribution={data.wordDistribution}
        enforcement={data.wordEnforcement}
        onDistributionChange={(value) => updateData({ wordDistribution: value })}
        onEnforcementChange={(value) => updateData({ wordEnforcement: value })}
      />
    </div>
  );
};
