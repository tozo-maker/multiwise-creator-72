
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDark } = useTheme();
  
  return (
    <Card 
      className={`border ${
        isSelected 
          ? isDark 
            ? 'border-indigo-500 bg-indigo-900/30' 
            : 'border-brand-500 bg-brand-50' 
          : isDark 
            ? 'border-slate-700 bg-slate-800/30' 
            : 'border-slate-200 bg-white'
      } p-0 cursor-pointer transition-all hover:shadow-md ${
        isDark 
          ? 'hover:border-indigo-400' 
          : 'hover:border-brand-300'
      }`}
      onClick={() => onSelect(template.id)}
    >
      <CardContent className="p-0">
        <div className="flex items-start space-x-4 p-4">
          <div className={`p-2 rounded-full ${
            isSelected 
              ? isDark 
                ? 'bg-indigo-900/50 text-indigo-400' 
                : 'bg-brand-100 text-brand-700' 
              : isDark 
                ? 'bg-slate-700 text-slate-300' 
                : 'bg-slate-100 text-slate-600'
          }`}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1">
            <p className={`font-medium ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {template.name}
            </p>
            <p className={`text-sm mt-1 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {template.description}
            </p>
            {template.targetLanguage && template.id !== 'custom' && (
              <div className="mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isDark 
                    ? 'bg-indigo-900/50 text-indigo-300' 
                    : 'bg-brand-100 text-brand-800'
                }`}>
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
