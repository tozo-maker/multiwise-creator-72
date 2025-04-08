
import React from 'react';
import { ConfigData } from '@/components/wizard/types';
import { ProjectTypeSelector } from '@/components/wizard/steps/project-config/ProjectTypeSelector';
import { SubjectSelector } from '@/components/wizard/steps/project-config/SubjectSelector';
import { PedagogySelector } from '@/components/wizard/steps/project-config/PedagogySelector';
import { EducationalLevelSelector } from '@/components/wizard/steps/project-config/EducationalLevelSelector';
import { WordCountInput } from '@/components/wizard/steps/project-config/WordCountInput';

interface ProjectConfigTabProps {
  configData: ConfigData;
  updateConfigData: (data: Partial<ConfigData>) => void;
}

export const ProjectConfigTab: React.FC<ProjectConfigTabProps> = ({ configData, updateConfigData }) => {
  return (
    <div className="text-slate-300 space-y-8">
      <p className="mb-6">Configure the project type, subjects, and educational standards.</p>
      
      <ProjectTypeSelector 
        projectType={configData.projectType}
        customProjectType={configData.customProjectType}
        onProjectTypeChange={(value) => updateConfigData({ projectType: value })}
        onCustomProjectTypeChange={(value) => updateConfigData({ customProjectType: value })}
      />
      
      <SubjectSelector 
        subjects={configData.subjects}
        onSubjectsChange={(subjects) => updateConfigData({ subjects })}
      />
      
      <EducationalLevelSelector
        levels={configData.levels}
        onLevelsChange={(levels) => updateConfigData({ levels })}
      />
      
      <PedagogySelector
        pedagogy={configData.pedagogy}
        customPedagogy={configData.customPedagogy}
        onPedagogyChange={(value) => updateConfigData({ pedagogy: value })}
        onCustomPedagogyChange={(value) => updateConfigData({ customPedagogy: value })}
      />
      
      <WordCountInput
        wordCount={configData.wordCount}
        distribution={configData.wordDistribution}
        enforcement={configData.wordEnforcement}
        onWordCountChange={(wordCount) => updateConfigData({ wordCount })}
        onDistributionChange={(wordDistribution) => updateConfigData({ wordDistribution })}
        onEnforcementChange={(wordEnforcement) => updateConfigData({ wordEnforcement })}
      />
    </div>
  );
};
