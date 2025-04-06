
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup } from '@/components/ui/radio-group';
import { 
  BookOpen, 
  GraduationCap, 
  Languages, 
  FileSpreadsheet,
  Calculator,
  Microscope,
  FileText,
  ScrollText
} from 'lucide-react';
import { ConfigData } from '../types';
import { TemplateCard } from './quick-start/TemplateCard';

interface QuickStartStepProps {
  data: Pick<ConfigData, 'quickStart' | 'targetLanguage'>;
  updateData: (data: Partial<ConfigData>) => void;
}

export const QuickStartStep: React.FC<QuickStartStepProps> = ({ data, updateData }) => {
  // Define templates with their default settings
  const templates = [
    {
      id: 'custom',
      name: 'Custom Configuration',
      description: 'Start from scratch with full customization options',
      icon: FileText,
      targetLanguage: data.targetLanguage || 'English'
    },
    {
      id: 'primary-math',
      name: 'Primary Mathematics',
      description: 'Elementary math curriculum with activities and assessments',
      icon: Calculator,
      targetLanguage: data.targetLanguage || 'English'
    },
    {
      id: 'secondary-science',
      name: 'Secondary Science',
      description: 'Comprehensive science materials for middle/high school',
      icon: Microscope,
      targetLanguage: data.targetLanguage || 'English'
    },
    {
      id: 'language-learning',
      name: 'Language Learning',
      description: 'Materials for teaching languages with cultural elements',
      icon: Languages,
      targetLanguage: data.targetLanguage || 'English'
    },
    {
      id: 'teacher-guide',
      name: 'Teacher Guide',
      description: 'Instructional guides and teaching resources',
      icon: ScrollText,
      targetLanguage: data.targetLanguage || 'English'
    }
  ];

  const handleSelectTemplate = (templateId: string) => {
    // Apply template defaults when selected
    updateData({ quickStart: templateId });
    
    // If the user selects a predefined template, we could also pre-fill other settings
    // based on the template selected, but for now, we'll just set the quickStart value
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Choose a starting point for your educational content project. You can customize all settings later.
      </div>
      
      <RadioGroup
        value={data.quickStart}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={data.quickStart === template.id}
            onSelect={handleSelectTemplate}
          />
        ))}
      </RadioGroup>
    </div>
  );
};
