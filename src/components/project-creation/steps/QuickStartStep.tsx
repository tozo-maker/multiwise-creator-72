
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  GraduationCap, 
  Languages, 
  FileSpreadsheet,
  Calculator,
  Microscope,
  FileText
} from 'lucide-react';

interface QuickStartStepProps {
  data: {
    quickStart?: string;
    templateId: string;
  };
  updateData: (data: Partial<QuickStartStepProps['data']>) => void;
}

export function QuickStartStep({ data, updateData }: QuickStartStepProps) {
  // Define templates
  const templates = [
    {
      id: 'custom',
      name: 'Custom Configuration',
      description: 'Start from scratch with full customization options',
      icon: FileText,
    },
    {
      id: 'primary-math',
      name: 'Primary Mathematics',
      description: 'Elementary math curriculum with activities and assessments',
      icon: Calculator,
    },
    {
      id: 'secondary-science',
      name: 'Secondary Science',
      description: 'Comprehensive science materials for middle/high school',
      icon: Microscope,
    },
    {
      id: 'language-learning',
      name: 'Language Learning',
      description: 'Materials for teaching languages with cultural elements',
      icon: Languages,
    },
    {
      id: 'teacher-guide',
      name: 'Teacher Guide',
      description: 'Instructional guides and teaching resources',
      icon: BookOpen,
    },
    {
      id: 'curriculum',
      name: 'Full Curriculum',
      description: 'Complete educational curriculum with all materials',
      icon: GraduationCap,
    }
  ];

  const handleSelectTemplate = (templateId: string) => {
    updateData({ 
      quickStart: templateId,
      templateId: templateId 
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-slate-100">Choose a Starting Point</h2>
        <p className="text-slate-400 mb-6">
          Select a template or start from scratch to configure your educational project.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer border-2 transition-all hover:shadow-md bg-slate-800/30 ${
              data.templateId === template.id 
                ? 'border-indigo-500' 
                : 'border-slate-700'
            }`}
            onClick={() => handleSelectTemplate(template.id)}
          >
            <CardContent className="p-6 flex items-start gap-4">
              <div className={`p-2 rounded-full ${
                data.templateId === template.id 
                  ? 'bg-indigo-900/50 text-indigo-400' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                <template.icon className="h-6 w-6" />
              </div>
              
              <div>
                <h3 className="font-medium text-slate-100">{template.name}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {template.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
