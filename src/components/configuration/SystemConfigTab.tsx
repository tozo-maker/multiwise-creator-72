
import React from 'react';
import { ConfigData } from '@/components/wizard/types';
import { StyledSelect } from './ui/StyledSelect';
import { ExperienceLevelSelector } from './ui/ExperienceLevelSelector';
import { InteractionModeSelector } from './ui/InteractionModeSelector';

interface SystemConfigTabProps {
  configData: ConfigData;
  updateConfigData: (data: Partial<ConfigData>) => void;
}

export const SystemConfigTab: React.FC<SystemConfigTabProps> = ({ configData, updateConfigData }) => {
  const experienceLevelOptions = [
    { 
      value: 'Beginner', 
      label: 'Beginner', 
      description: 'I\'m new to creating educational materials' 
    },
    { 
      value: 'Intermediate', 
      label: 'Intermediate', 
      description: 'I have some experience with content creation' 
    },
    { 
      value: 'Advanced', 
      label: 'Advanced', 
      description: 'I\'m experienced in educational content development' 
    }
  ];

  const interactionModeOptions = [
    { 
      value: 'Conversational', 
      label: 'Conversational', 
      description: 'Interact through natural dialogue' 
    },
    { 
      value: 'Structured', 
      label: 'Structured', 
      description: 'Guided form-based interaction' 
    },
    { 
      value: 'Direct', 
      label: 'Direct', 
      description: 'Minimal interaction, focus on results' 
    },
    { 
      value: 'Collaborative', 
      label: 'Collaborative', 
      description: 'Iterative back-and-forth approach' 
    }
  ];

  const interfaceLanguageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' }
  ];

  const outputDetailOptions = [
    { value: 'Detailed', label: 'Detailed - Comprehensive explanations' },
    { value: 'Balanced', label: 'Balanced - Moderate detail' },
    { value: 'Concise', label: 'Concise - Brief outputs' }
  ];

  const behaviorStyleOptions = [
    { value: 'Creative', label: 'Creative - More innovative outputs' },
    { value: 'Balanced', label: 'Balanced - Mix of creativity and precision' },
    { value: 'Precise', label: 'Precise - Focus on accuracy' }
  ];

  return (
    <div className="text-slate-300">
      <p className="mb-6">Configure how you want to interact with the system and how it should respond to you.</p>
    
      <div className="space-y-8">
        <StyledSelect
          id="interfaceLanguage"
          label="Interface Language"
          tooltip="Language used for the interface elements"
          value={configData.interfaceLanguage}
          onChange={(value) => updateConfigData({ interfaceLanguage: value })}
          options={interfaceLanguageOptions}
        />
        
        <ExperienceLevelSelector
          value={configData.experienceLevel}
          onChange={(value) => updateConfigData({ experienceLevel: value })}
          options={experienceLevelOptions}
        />
        
        <InteractionModeSelector
          value={configData.interactionMode || "Guided"}
          onChange={(value) => updateConfigData({ interactionMode: value })}
          options={interactionModeOptions}
        />
        
        <StyledSelect
          id="outputDetail"
          label="Output Detail Level"
          tooltip="Level of detail in system responses"
          value={configData.outputDetail}
          onChange={(value) => updateConfigData({ outputDetail: value })}
          options={outputDetailOptions}
        />
        
        <StyledSelect
          id="systemBehavior"
          label="System Behavior Style"
          tooltip="How the system should behave when generating content"
          value={configData.systemBehavior}
          onChange={(value) => updateConfigData({ systemBehavior: value })}
          options={behaviorStyleOptions}
        />
      </div>
    </div>
  );
};
