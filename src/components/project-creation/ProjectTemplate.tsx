
import React from 'react';
import { FileText, BookOpen, CheckCircle2 } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Languages, ClipboardCheck } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

interface ProjectTemplateProps {
  template: Template;
  onSelect: () => void;
  isSelected?: boolean;
}

export const ProjectTemplate: React.FC<ProjectTemplateProps> = ({ 
  template,
  onSelect,
  isSelected = false,
}) => {
  const getIcon = () => {
    switch (template.icon) {
      case 'file-text':
        return <FileText className="h-8 w-8 text-brand-500" />;
      case 'book-open':
        return <BookOpen className="h-8 w-8 text-brand-500" />;
      case 'languages':
        return <Languages className="h-8 w-8 text-brand-500" />;
      case 'clipboard-check':
        return <ClipboardCheck className="h-8 w-8 text-brand-500" />;
      default:
        return <FileText className="h-8 w-8 text-brand-500" />;
    }
  };

  return (
    <Card className={cn(
      "h-full transition-all duration-200 hover:shadow-md overflow-hidden",
      isSelected ? "ring-2 ring-brand-500 shadow-md" : "hover:border-brand-200"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          {getIcon()}
          {isSelected && (
            <Badge className="bg-brand-500">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Selected
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg mt-2">{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-0">
        <ul className="space-y-1">
          {template.features.map((feature, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-center">
              <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-brand-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button 
          className="w-full bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200"
          variant="outline"
          onClick={onSelect}
        >
          {isSelected ? "Selected" : "Choose template"}
        </Button>
      </CardFooter>
    </Card>
  );
};
