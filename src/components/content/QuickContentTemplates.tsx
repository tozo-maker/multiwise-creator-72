
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
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
    { name: 'Vocabulary List', description: 'Create a themed vocabulary list' },
    { name: 'Grammar Explanation', description: 'Explain a grammar concept' },
    { name: 'Practice Exercise', description: 'Generate practice activities' },
    { name: 'Cultural Note', description: 'Add cultural context' },
  ];
  
  return (
    <Card className={theme === 'dark' 
      ? "bg-slate-900 border-slate-800" 
      : "bg-white border-slate-200"
    }>
      <CardHeader>
        <CardTitle className={`text-lg ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Quick Content Creation</CardTitle>
        <CardDescription className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
          Generate new content with AI assistance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full justify-start gap-2 mb-3 bg-brand-600 hover:bg-brand-700 text-white" 
          onClick={() => navigate(`/projects/${projectId}/content/new`)}
        >
          <Plus className="h-4 w-4" />
          New Chapter/Section
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
              onClick={() => navigate(`/projects/${projectId}/content/new`)}
            >
              <div className="text-left">
                <div className="font-medium">{template.name}</div>
                <div className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{template.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
