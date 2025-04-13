
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Languages, GlobeIcon, Lightbulb, BookOpen, FileSymlink, ListChecks } from 'lucide-react';
import { EnhancedProjectData } from '../../types/project-wizard-types';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EnhancedLanguageConfigStepProps {
  data: EnhancedProjectData;
  updateData: (data: Partial<EnhancedProjectData>) => void;
}

export function EnhancedLanguageConfigStep({ data, updateData }: EnhancedLanguageConfigStepProps) {
  const { isDark } = useTheme();
  const [customStandard, setCustomStandard] = useState('');
  
  // Target Language options
  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Chinese', label: 'Chinese (Mandarin)' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Arabic', label: 'Arabic' },
    { value: 'Russian', label: 'Russian' },
    { value: 'Portuguese', label: 'Portuguese' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Korean', label: 'Korean' },
    { value: 'Hindi', label: 'Hindi' },
  ];
  
  // Language Goal options
  const goalOptions = [
    {
      value: 'Teaching',
      label: 'Teaching',
      description: 'Primary language instruction'
    },
    {
      value: 'Practice',
      label: 'Practice',
      description: 'Reinforcement of existing skills'
    },
    {
      value: 'Reference',
      label: 'Reference',
      description: 'Support material for consultation'
    },
    {
      value: 'Assessment',
      label: 'Assessment',
      description: 'Evaluation of language proficiency'
    },
    {
      value: 'Cultural',
      label: 'Cultural Immersion',
      description: 'Focus on cultural aspects through language'
    }
  ];
  
  // Complexity options
  const complexityOptions = [
    { value: 'Beginner', label: 'Beginner (A1-A2)' },
    { value: 'Intermediate', label: 'Intermediate (B1-B2)' },
    { value: 'Advanced', label: 'Advanced (C1-C2)' },
    { value: 'Mixed', label: 'Mixed Levels' },
  ];
  
  // Cultural Integration options
  const culturalIntegrationOptions = [
    {
      value: 'Minimal',
      label: 'Minimal',
      description: 'Focus on language mechanics with limited cultural context'
    },
    {
      value: 'Standard',
      label: 'Standard',
      description: 'Basic cultural information integrated with language content'
    },
    {
      value: 'Enhanced',
      label: 'Enhanced',
      description: 'Significant cultural context throughout materials'
    },
    {
      value: 'Immersive',
      label: 'Immersive',
      description: 'Deep cultural integration with authentic materials'
    }
  ];
  
  // Terminology strategies
  const terminologyOptions = [
    {
      value: 'Standard',
      label: 'Standard',
      description: 'General educational terminology'
    },
    {
      value: 'Content-Language',
      label: 'Content-Language Integrated',
      description: 'Subject-specific terminology in target language'
    },
    {
      value: 'Glossary',
      label: 'Glossary-Based',
      description: 'Explicit terminology sections with definitions'
    },
    {
      value: 'Progressive',
      label: 'Progressive',
      description: 'Gradually introduced specialized terms'
    },
    {
      value: 'Custom',
      label: 'Custom Approach',
      description: 'Define your own terminology strategy'
    }
  ];
  
  // Level markers
  const markerOptions = [
    { value: 'Headings', label: 'Headings & Subheadings' },
    { value: 'Icons', label: 'Visual Icons & Symbols' },
    { value: 'Color', label: 'Color Coding' },
    { value: 'Tags', label: 'Explicit Level Tags' },
    { value: 'None', label: 'No Differentiation' },
    { value: 'Custom', label: 'Custom Markers' }
  ];
  
  // Curriculum standards
  const standardsCategories = {
    'US': ['Common Core', 'ACTFL', 'Next Gen Science', 'C3 Framework'],
    'International': ['CEFR', 'IB', 'Cambridge', 'PISA'],
    'Language-Specific': ['ALTE', 'JF Standard', 'HSK', 'DELE/DELF'],
    'Other': ['National', 'State/Regional', 'Institution-Specific', 'custom']
  };
  
  // Structure styles
  const structureOptions = [
    { value: 'Traditional', label: 'Traditional (Chapters & Sections)' },
    { value: 'Modular', label: 'Modular (Independent Units)' },
    { value: 'Progressive', label: 'Progressive (Building Complexity)' },
    { value: 'Task-Based', label: 'Task-Based (Problem-Centered)' },
    { value: 'Narrative', label: 'Narrative (Story-Driven)' },
    { value: 'Custom', label: 'Custom Structure' }
  ];
  
  // Add standard handler
  const handleAddStandard = () => {
    if (!customStandard.trim()) return;
    
    updateData({ 
      customStandards: [...data.customStandards, customStandard.trim()] 
    });
    setCustomStandard('');
  };
  
  // Remove standard handler
  const handleRemoveStandard = (standard: string) => {
    if (data.standards.includes(standard)) {
      updateData({
        standards: data.standards.filter(s => s !== standard)
      });
    } else {
      updateData({
        customStandards: data.customStandards.filter(s => s !== standard)
      });
    }
  };
  
  // Toggle standard in standards array
  const toggleStandard = (standard: string) => {
    const currentStandards = [...data.standards];
    if (currentStandards.includes(standard)) {
      updateData({ standards: currentStandards.filter(s => s !== standard) });
    } else {
      updateData({ standards: [...currentStandards, standard] });
    }
  };
  
  // Helper to display standards
  const renderSelectedStandards = () => {
    const allStandards = [
      ...data.standards.map(s => ({ value: s, isCustom: false })),
      ...data.customStandards.map(s => ({ value: s, isCustom: true }))
    ];
    
    if (allStandards.length === 0) {
      return <p className="text-sm text-muted-foreground">No curriculum standards selected</p>;
    }
    
    return (
      <div className="flex flex-wrap gap-2">
        {allStandards.map(standard => (
          <Badge 
            key={standard.value}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            {standard.value}
            <button 
              type="button"
              onClick={() => handleRemoveStandard(standard.value)}
              className="ml-1 text-xs hover:text-destructive"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Target Language */}
      <div className="space-y-4">
        <div className="flex items-center">
          <Languages className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Target Language
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                The primary language being taught or used in the content
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Select 
          value={data.targetLanguage} 
          onValueChange={(value) => updateData({ targetLanguage: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select target language" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Language & Culture Goal */}
      <div className="space-y-4">
        <div className="flex items-center">
          <GlobeIcon className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Language & Culture Goal
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                The primary purpose of your language content
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <RadioGroup 
          value={data.goal}
          onValueChange={(value) => updateData({ goal: value })}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {goalOptions.map(option => (
            <div key={option.value} className="relative">
              <RadioGroupItem 
                value={option.value} 
                id={`goal-${option.value}`}
                className="absolute opacity-0"
              />
              <Label
                htmlFor={`goal-${option.value}`}
                className={`block rounded-lg border-2 p-3 cursor-pointer transition-colors h-full ${
                  data.goal === option.value 
                    ? `${isDark ? 'bg-indigo-950/50 border-indigo-500' : 'bg-indigo-50 border-indigo-500'}`
                    : `${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300'}`
                }`}
              >
                <div className="font-medium mb-1">{option.label}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Complexity Level */}
        <div className="space-y-4">
          <div className="flex items-center">
            <Lightbulb className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Complexity Level
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  The difficulty level of your language content
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <RadioGroup 
            value={data.complexity}
            onValueChange={(value) => updateData({ complexity: value })}
            className="space-y-3"
          >
            {complexityOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`complexity-${option.value}`} />
                <Label htmlFor={`complexity-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Cultural Integration */}
        <div className="space-y-4">
          <div className="flex items-center">
            <BookOpen className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Cultural Integration
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  How deeply cultural context is integrated with language content
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <RadioGroup 
            value={data.culturalIntegration}
            onValueChange={(value) => updateData({ culturalIntegration: value })}
            className="space-y-3"
          >
            {culturalIntegrationOptions.map(option => (
              <div key={option.value} className="relative">
                <RadioGroupItem 
                  value={option.value} 
                  id={`culture-${option.value}`}
                  className="absolute opacity-0"
                />
                <Label
                  htmlFor={`culture-${option.value}`}
                  className={`block rounded-lg border-2 p-3 cursor-pointer transition-colors ${
                    data.culturalIntegration === option.value 
                      ? `${isDark ? 'bg-indigo-950/50 border-indigo-500' : 'bg-indigo-50 border-indigo-500'}`
                      : `${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300'}`
                  }`}
                >
                  <div className="font-medium mb-1">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      
      {/* Terminology Strategy */}
      <div className="space-y-4">
        <div className="flex items-center">
          <FileSymlink className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Terminology Strategy
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                How specialized terminology is presented and explained
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <RadioGroup 
          value={data.terminology}
          onValueChange={(value) => updateData({ terminology: value })}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {terminologyOptions.map(option => (
            <div key={option.value} className="relative">
              <RadioGroupItem 
                value={option.value} 
                id={`term-${option.value}`}
                className="absolute opacity-0"
              />
              <Label
                htmlFor={`term-${option.value}`}
                className={`block rounded-lg border-2 p-3 cursor-pointer transition-colors ${
                  data.terminology === option.value 
                    ? `${isDark ? 'bg-indigo-950/50 border-indigo-500' : 'bg-indigo-50 border-indigo-500'}`
                    : `${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300'}`
                }`}
              >
                <div className="font-medium mb-1">{option.label}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Level Differentiation Markers */}
      <div className="space-y-4">
        <div className="flex items-center">
          <ListChecks className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Level Differentiation Markers
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                How different difficulty levels are indicated within content
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <RadioGroup 
          value={data.markers}
          onValueChange={(value) => updateData({ markers: value })}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {markerOptions.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`marker-${option.value}`} />
              <Label htmlFor={`marker-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Curriculum Standards */}
      <div className="space-y-4">
        <div className="flex items-center">
          <ListChecks className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Curriculum Standards
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Select educational standards to align with your content
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Tabs defaultValue="US" className="w-full">
          <TabsList className="mb-4">
            {Object.keys(standardsCategories).map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(standardsCategories).map(([category, standards]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {standards.map(standard => (
                  standard !== 'custom' ? (
                    <div key={standard} className="flex items-center space-x-2">
                      <Checkbox
                        id={`standard-${standard}`}
                        checked={data.standards.includes(standard)}
                        onCheckedChange={() => toggleStandard(standard)}
                      />
                      <Label htmlFor={`standard-${standard}`}>{standard}</Label>
                    </div>
                  ) : (
                    <div key="custom-standard" className="space-y-2">
                      <Label htmlFor="custom-standard">Add Custom Standard</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="custom-standard"
                          value={customStandard}
                          onChange={(e) => setCustomStandard(e.target.value)}
                          placeholder="Enter custom standard"
                        />
                        <Button onClick={handleAddStandard} type="button">Add</Button>
                      </div>
                    </div>
                  )
                ))}
              </div>
              
              <div className="mt-4">
                <Label className="block mb-2">Selected Standards:</Label>
                {renderSelectedStandards()}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Internal Structure */}
      <div className="space-y-4">
        <div className="flex items-center">
          <FileSymlink className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Internal Structure Style
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                How your content is organized and structured
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <RadioGroup 
          value={data.structure}
          onValueChange={(value) => updateData({ structure: value })}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {structureOptions.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`structure-${option.value}`} />
              <Label htmlFor={`structure-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
