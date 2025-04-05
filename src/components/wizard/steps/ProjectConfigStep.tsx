
import React from 'react';
import { ProjectTypeSelector } from './project-config/ProjectTypeSelector';
import { SubjectSelector } from './project-config/SubjectSelector';
import { EducationalLevelSelector } from './project-config/EducationalLevelSelector';
import { PedagogySelector } from './project-config/PedagogySelector';
import { WordCountInput } from './project-config/WordCountInput';

interface ProjectConfigProps {
  data: {
    projectType: string;
    subjects: string[];
    levels: string[];
    pedagogy: string;
    wordCount: number;
  };
  updateData: (data: Partial<{
    projectType: string;
    subjects: string[];
    levels: string[];
    pedagogy: string;
    wordCount: number;
  }>) => void;
}

export const ProjectConfigStep: React.FC<ProjectConfigProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <ProjectTypeSelector 
        projectType={data.projectType} 
        onProjectTypeChange={(value) => updateData({ projectType: value })} 
      />
      
      <SubjectSelector 
        subjects={data.subjects} 
        onSubjectsChange={(subjects) => updateData({ subjects })} 
      />
      
      <EducationalLevelSelector 
        levels={data.levels} 
        onLevelsChange={(levels) => updateData({ levels })} 
      />
      
      <PedagogySelector 
        pedagogy={data.pedagogy} 
        onPedagogyChange={(value) => updateData({ pedagogy: value })} 
      />
      
      <WordCountInput 
        wordCount={data.wordCount} 
        onWordCountChange={(value) => updateData({ wordCount: value })} 
      />
    </div>
  );
};
