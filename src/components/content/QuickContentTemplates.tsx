
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickContentTemplatesProps {
  projectId: string;
}

export const QuickContentTemplates: React.FC<QuickContentTemplatesProps> = ({ projectId }) => {
  const navigate = useNavigate();
  
  const templates = [
    { name: 'Vocabulary List', description: 'Create a themed vocabulary list' },
    { name: 'Grammar Explanation', description: 'Explain a grammar concept' },
    { name: 'Practice Exercise', description: 'Generate practice activities' },
    { name: 'Cultural Note', description: 'Add cultural context' },
  ];
  
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg text-slate-100">Quick Content Creation</CardTitle>
        <CardDescription className="text-slate-400">
          Generate new content with AI assistance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full justify-start gap-2 mb-3 bg-indigo-600 hover:bg-indigo-700 text-white" 
          onClick={() => navigate(`/projects/${projectId}/content/new`)}
        >
          <Plus className="h-4 w-4" />
          New Chapter/Section
        </Button>
        
        <div className="text-sm text-slate-400 mb-4">
          Content templates:
        </div>
        
        <div className="space-y-2">
          {templates.map((template, i) => (
            <Button 
              key={i}
              variant="outline" 
              className="w-full justify-start h-auto py-3 border-slate-700 text-slate-300 hover:bg-slate-700"
              onClick={() => navigate(`/projects/${projectId}/content/new`)}
            >
              <div className="text-left">
                <div className="font-medium">{template.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{template.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
