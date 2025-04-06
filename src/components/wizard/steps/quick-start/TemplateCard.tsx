
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    targetLanguage: string;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect
}) => {
  const { id, name, description, icon: Icon, targetLanguage } = template;
  
  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer transition-all
        ${isSelected 
          ? 'border-2 border-brand-500 shadow-md' 
          : 'hover:border-brand-200 hover:bg-slate-50'
        }`}
      onClick={() => onSelect(id)}
    >
      <CardContent className="p-6">
        <div className="absolute top-4 left-4">
          <RadioGroupItem value={id} id={id} className="sr-only" />
        </div>
        
        <div className="flex items-start mb-4">
          <div 
            className={`rounded-full p-2 mr-4 
              ${isSelected ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-700'}`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-lg">{name}</div>
            <p className="text-muted-foreground text-sm mt-1">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <Badge variant="outline" className="text-xs font-normal">
            {id === 'custom' ? 'Customizable' : 'Pre-configured'}
          </Badge>
          
          <Badge 
            variant={isSelected ? "default" : "secondary"}
            className="text-xs"
          >
            {targetLanguage}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
