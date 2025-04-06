
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface TemplateProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  targetLanguage?: string;
}

interface TemplateCardProps {
  template: TemplateProps;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
}) => {
  const Icon = template.icon;
  
  return (
    <Card 
      className={`border-2 ${
        isSelected ? 'border-brand-500 bg-brand-50' : 'border-slate-200'
      } p-0 cursor-pointer transition-all hover:border-brand-300 hover:bg-slate-50`}
      onClick={() => onSelect(template.id)}
    >
      <CardContent className="p-0">
        <div className="flex items-start space-x-3 p-4">
          <div className="flex items-center justify-center h-5">
            <div className={`h-4 w-4 rounded-full border ${
              isSelected 
                ? 'border-brand-500 bg-brand-500' 
                : 'border-primary'
            }`}>
              {isSelected && (
                <div className="h-2.5 w-2.5 rounded-full bg-white m-auto mt-0.75"></div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-brand-600" />
              <p className="font-medium">{template.name}</p>
            </div>
            <p className="text-sm text-slate-500 mt-1">{template.description}</p>
            {template.targetLanguage && template.id !== 'custom' && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                  {template.targetLanguage}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
