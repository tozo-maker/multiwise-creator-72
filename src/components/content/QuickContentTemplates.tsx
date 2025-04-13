
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Book, CheckSquare, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';

interface QuickContentTemplatesProps {
  projectId: string;
}

export const QuickContentTemplates: React.FC<QuickContentTemplatesProps> = ({ projectId }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const templates = [
    { 
      name: 'Lesson', 
      description: 'Create a structured lesson', 
      icon: <Book className="h-4 w-4" />,
      type: 'lesson'
    },
    { 
      name: 'Quiz', 
      description: 'Generate interactive questions',
      icon: <CheckSquare className="h-4 w-4" />,
      type: 'quiz'
    },
    { 
      name: 'Activity', 
      description: 'Design engaging activities',
      icon: <Users className="h-4 w-4" />,
      type: 'activity'
    },
    { 
      name: 'Summary', 
      description: 'Create concise topic summaries',
      icon: <FileText className="h-4 w-4" />,
      type: 'summary'
    }
  ];

  const handleNewContent = () => {
    navigate(`/projects/${projectId}/content/new-enhanced`);
  };
  
  const handleTemplateClick = (type: string) => {
    navigate(`/projects/${projectId}/content/new-enhanced?type=${type}`);
  };
  
  return (
    <Card className={theme === 'dark' 
      ? "bg-slate-900 border-slate-800" 
      : "bg-white border-slate-200"
    }>
      <CardHeader>
        <CardTitle className={`text-lg ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Quick Content Creation</CardTitle>
        <CardDescription className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
          Generate new content with AI templates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full justify-start gap-2 mb-3 bg-brand-600 hover:bg-brand-700 text-white" 
          onClick={handleNewContent}
        >
          <Plus className="h-4 w-4" />
          New Content
        </Button>
        
        <div className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          Content templates:
        </div>
        
        <div className="space-y-2">
          {templates.map((template, i) => (
            <Button 
              key={i}
              variant="outline" 
              className={`w-full justify-start h-auto py-3 ${
                theme === 'dark'
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800 bg-slate-900/50'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50 bg-white'
              }`}
              onClick={() => handleTemplateClick(template.type)}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  p-2 rounded-md
                  ${template.type === 'lesson' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                  ${template.type === 'quiz' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : ''}
                  ${template.type === 'activity' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : ''}
                  ${template.type === 'summary' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : ''}
                `}>
                  {template.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium">{template.name}</div>
                  <div className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{template.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
