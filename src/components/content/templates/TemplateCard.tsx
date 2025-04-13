
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContentTemplate } from '@/services/TemplateService';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronRight } from 'lucide-react';

interface TemplateCardProps {
  template: ContentTemplate;
  onSelect: () => void;
  icon: React.ReactNode;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onSelect,
  icon
}) => {
  const { isDark } = useTheme();
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'quiz':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'activity':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'assessment':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'summary':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300';
    }
  };

  return (
    <Card className={`
      overflow-hidden transition-all duration-200 hover:shadow-md hover:border-brand-300
      ${isDark ? 'bg-slate-800 border-slate-700 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-300'}
    `}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className={`p-2 rounded-md ${getTypeColor(template.type)}`}>
            {icon}
          </div>
          <span className={`
            text-xs font-medium px-2.5 py-0.5 rounded-full
            ${getTypeColor(template.type)}
          `}>
            {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
          </span>
        </div>
        <CardTitle className="mt-2">{template.name}</CardTitle>
        <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <p className="mb-1">Includes:</p>
          <ul className="space-y-1 list-disc list-inside pl-1">
            {template.structure.sections
              .filter((_, index) => index < 3)
              .map(section => (
                <li key={section.id}>{section.name}</li>
              ))}
            {template.structure.sections.length > 3 && (
              <li>+{template.structure.sections.length - 3} more sections</li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className={isDark ? 'border-t border-slate-700' : 'border-t border-slate-100'}>
        <Button 
          variant="ghost" 
          className={`w-full justify-between ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
          onClick={onSelect}
        >
          Use Template
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
