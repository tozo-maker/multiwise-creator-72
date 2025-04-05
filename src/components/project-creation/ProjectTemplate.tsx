
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, BookOpen, Languages, ClipboardCheck, ArrowRight } from 'lucide-react';

interface ProjectTemplateProps {
  template: {
    id: string;
    name: string;
    description: string;
    icon: string;
    features: string[];
  };
  onSelect: () => void;
}

export function ProjectTemplate({ template, onSelect }: ProjectTemplateProps) {
  const getIcon = () => {
    switch (template.icon) {
      case 'book-open':
        return <BookOpen className="h-8 w-8 text-brand-500" />;
      case 'languages':
        return <Languages className="h-8 w-8 text-brand-500" />;
      case 'clipboard-check':
        return <ClipboardCheck className="h-8 w-8 text-brand-500" />;
      case 'file-text':
      default:
        return <FileText className="h-8 w-8 text-brand-500" />;
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-brand-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-2">
          {getIcon()}
        </div>
        <CardTitle className="text-xl">{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ul className="space-y-1">
          {template.features.map((feature, i) => (
            <li key={i} className="flex items-center text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mr-2"></div>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-brand-500 hover:bg-brand-600" 
          onClick={onSelect}
        >
          Select Template
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
