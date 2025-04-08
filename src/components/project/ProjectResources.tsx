
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Book, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectResourcesProps {
  projectId: string;
}

export const ProjectResources: React.FC<ProjectResourcesProps> = ({ projectId }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const resources = [
    {
      id: 1,
      title: 'Curriculum Standards',
      type: 'PDF',
      date: '2023-04-10',
      icon: FileText
    },
    {
      id: 2,
      title: 'Chapter 1 Draft',
      type: 'DOCX',
      date: '2023-04-15',
      icon: Book
    },
    {
      id: 3,
      title: 'External Resources',
      type: 'URL',
      date: '2023-04-18',
      icon: LinkIcon
    }
  ];
  
  return (
    <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Project Resources</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className={`${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
          asChild
        >
          <Link to={`/projects/${projectId}/knowledge-base`}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Resource
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-slate-700">
          {resources.map(resource => (
            <div key={resource.id} className={`flex items-center gap-3 py-3 ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} flex items-center justify-center flex-shrink-0`}>
                <resource.icon className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{resource.title}</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{resource.type} • {resource.date}</p>
              </div>
              <Button variant="ghost" size="sm" className={`px-2 ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`}>
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
