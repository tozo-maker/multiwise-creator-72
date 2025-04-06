
import React from 'react';
import { ProjectTypeSelector } from './project-config/ProjectTypeSelector';
import { SubjectSelector } from './project-config/SubjectSelector';
import { EducationalLevelSelector } from './project-config/EducationalLevelSelector';
import { PedagogySelector } from './project-config/PedagogySelector';
import { WordCountInput } from './project-config/WordCountInput';
import { Card, CardContent } from '@/components/ui/card';
import { ConfigData } from '../types';

interface ProjectConfigProps {
  data: Pick<ConfigData, 
    'projectType' | 
    'customProjectType' |
    'subjects' | 
    'levels' | 
    'pedagogy' |
    'customPedagogy' |
    'wordCount' |
    'wordDistribution' |
    'wordEnforcement'
  >;
  updateData: (data: Partial<ConfigData>) => void;
}

export const ProjectConfigStep: React.FC<ProjectConfigProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-8">
      {/* Project Type Section */}
      <Card className="border-slate-200">
        <CardContent className="pt-6 pb-4">
          <ProjectTypeSelector 
            projectType={data.projectType} 
            customProjectType={data.customProjectType}
            onProjectTypeChange={(value) => updateData({ projectType: value })} 
            onCustomProjectTypeChange={(value) => updateData({ customProjectType: value })}
          />
        </CardContent>
      </Card>

      {/* Two Column Layout for Subjects and Levels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 h-full">
          <CardContent className="pt-6 pb-4 h-full">
            <SubjectSelector 
              subjects={data.subjects} 
              onSubjectsChange={(subjects) => updateData({ subjects })} 
            />
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 h-full">
          <CardContent className="pt-6 pb-4 h-full">
            <EducationalLevelSelector 
              levels={data.levels} 
              onLevelsChange={(levels) => updateData({ levels })} 
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Pedagogy Selector */}
      <Card className="border-slate-200">
        <CardContent className="pt-6 pb-4">
          <PedagogySelector 
            pedagogy={data.pedagogy}
            customPedagogy={data.customPedagogy} 
            onPedagogyChange={(value) => updateData({ pedagogy: value })} 
            onCustomPedagogyChange={(value) => updateData({ customPedagogy: value })}
          />
        </CardContent>
      </Card>
      
      {/* Enhanced Word Count Settings */}
      <Card className="border-slate-200">
        <CardContent className="pt-6 pb-4">
          <WordCountInput 
            wordCount={data.wordCount} 
            onWordCountChange={(value) => updateData({ wordCount: value })} 
            distribution={data.wordDistribution}
            enforcement={data.wordEnforcement}
            onDistributionChange={(value) => updateData({ wordDistribution: value })}
            onEnforcementChange={(value) => updateData({ wordEnforcement: value })}
          />
        </CardContent>
      </Card>
    </div>
  );
};
