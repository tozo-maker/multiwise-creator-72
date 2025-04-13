
import React, { useState, useEffect } from 'react';
import { ContentTemplate, TemplateService } from '@/services/TemplateService';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Book, CheckSquare, Users, ClipboardCheck, FileText, LayoutGrid } from 'lucide-react';
import { TemplateCard } from './TemplateCard';

interface TemplateSelectorProps {
  onSelectTemplate: (template: ContentTemplate) => void;
  selectedType?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  onSelectTemplate,
  selectedType = 'all' 
}) => {
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(selectedType);
  const { isDark } = useTheme();
  
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const allTemplates = await TemplateService.getTemplates();
        setTemplates(allTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTemplates();
  }, []);
  
  const getTemplateIcon = (templateType: string) => {
    switch (templateType) {
      case 'lesson':
        return <Book className="h-5 w-5" />;
      case 'quiz':
        return <CheckSquare className="h-5 w-5" />;
      case 'activity':
        return <Users className="h-5 w-5" />;
      case 'assessment':
        return <ClipboardCheck className="h-5 w-5" />;
      case 'summary':
        return <FileText className="h-5 w-5" />;
      default:
        return <LayoutGrid className="h-5 w-5" />;
    }
  };
  
  const filterTemplates = (type: string) => {
    if (type === 'all') {
      return templates;
    }
    return templates.filter(template => template.type === type);
  };
  
  const templateTypes = [
    { id: 'all', name: 'All Templates' },
    { id: 'lesson', name: 'Lessons' },
    { id: 'quiz', name: 'Quizzes' },
    { id: 'activity', name: 'Activities' },
    { id: 'assessment', name: 'Assessments' },
    { id: 'summary', name: 'Summaries' }
  ];

  return (
    <Card className={isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}>
      <CardContent className="pt-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full grid grid-cols-3 md:grid-cols-6">
            {templateTypes.map(type => (
              <TabsTrigger 
                key={type.id} 
                value={type.id}
                className="flex items-center gap-2"
              >
                {type.id !== 'all' && getTemplateIcon(type.id)}
                <span className="hidden md:inline">{type.name}</span>
                <span className="inline md:hidden">{type.id !== 'all' ? type.name.slice(0, -1) : 'All'}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {templateTypes.map(type => (
            <TabsContent key={type.id} value={type.id} className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterTemplates(type.id).map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onSelect={() => onSelectTemplate(template)}
                      icon={getTemplateIcon(template.type)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
