
import React from 'react';
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
import { useTheme } from '@/contexts/ThemeContext';

interface QuickStartStepProps {
  data: Pick<ConfigData, 'quickStart' | 'targetLanguage'>;
  updateData: (data: Partial<ConfigData>) => void;
}

export const QuickStartStep: React.FC<QuickStartStepProps> = ({ data, updateData }) => {
  const { isDark } = useTheme();
  
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
      <div>
        <h2 className={`text-2xl font-semibold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          Choose a Starting Point
        </h2>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-6`}>
          Select a template or start from scratch to configure your educational project.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={data.quickStart === template.id}
            onSelect={handleSelectTemplate}
          />
        ))}
      </div>
    </div>
  );
};
