
import React, { useState, useEffect } from 'react';
import { ContentTemplate, TemplateParameter } from '@/services/TemplateService';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowRight, Settings2 } from 'lucide-react';

interface TemplateParameterFormProps {
  template: ContentTemplate;
  onParametersChange: (values: Record<string, any>) => void;
  onGenerateContent: () => void;
  isGenerating?: boolean;
}

export const TemplateParameterForm: React.FC<TemplateParameterFormProps> = ({
  template,
  onParametersChange,
  onGenerateContent,
  isGenerating = false
}) => {
  const { isDark } = useTheme();
  const [paramValues, setParamValues] = useState<Record<string, any>>({});
  
  // Initialize parameter values with defaults
  useEffect(() => {
    if (template && template.parameters) {
      const initialValues = template.parameters.reduce((acc, param) => {
        acc[param.id] = param.defaultValue !== undefined ? param.defaultValue : '';
        return acc;
      }, {} as Record<string, any>);
      
      setParamValues(initialValues);
      onParametersChange(initialValues);
    }
  }, [template, onParametersChange]);
  
  const handleParamChange = (id: string, value: any) => {
    setParamValues(prev => {
      const updated = { ...prev, [id]: value };
      onParametersChange(updated);
      return updated;
    });
  };
  
  const renderParameterInput = (param: TemplateParameter) => {
    switch (param.type) {
      case 'text':
        return (
          <Input
            id={param.id}
            value={paramValues[param.id] || ''}
            onChange={(e) => handleParamChange(param.id, e.target.value)}
            placeholder={param.placeholder || ''}
            className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}
          />
        );
        
      case 'number':
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>1</span>
              <span>{paramValues[param.id] || param.defaultValue || 1}</span>
              <span>20</span>
            </div>
            <Slider
              id={param.id}
              value={[paramValues[param.id] || param.defaultValue || 1]}
              min={1}
              max={20}
              step={1}
              onValueChange={(value) => handleParamChange(param.id, value[0])}
            />
          </div>
        );
        
      case 'select':
        return (
          <Select
            value={paramValues[param.id] || ''}
            onValueChange={(value) => handleParamChange(param.id, value)}
          >
            <SelectTrigger className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {param.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1).replace(/-/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={param.id}
              checked={!!paramValues[param.id]}
              onCheckedChange={(checked) => handleParamChange(param.id, checked)}
            />
            <Label htmlFor={param.id} className="cursor-pointer">
              {paramValues[param.id] ? 'Yes' : 'No'}
            </Label>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}>
      <CardHeader>
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2">
          <Settings2 className="h-5 w-5" />
          <span className="text-sm font-medium">Template Settings</span>
        </div>
        <CardTitle>{template.name} Parameters</CardTitle>
        <CardDescription>
          Customize the template parameters to generate your content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {template.parameters.map((param) => (
            <div key={param.id} className="space-y-2">
              <Label 
                htmlFor={param.id}
                className={`text-sm font-medium ${param.required ? 'after:content-["*"] after:text-red-500 after:ml-0.5' : ''}`}
              >
                {param.name}
              </Label>
              <div className="mt-1">{renderParameterInput(param)}</div>
              {param.description && (
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {param.description}
                </p>
              )}
            </div>
          ))}
          
          <Separator className={isDark ? 'bg-slate-700' : 'bg-slate-200'} />
          
          <div className="pt-4">
            <Button 
              onClick={onGenerateContent}
              disabled={isGenerating}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white"
            >
              {isGenerating ? 'Generating...' : 'Generate Content'}
              {!isGenerating && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
