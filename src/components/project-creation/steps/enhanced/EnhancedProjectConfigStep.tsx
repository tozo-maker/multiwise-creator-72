
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Book, BookType, GraduationCap, FileType, AlignJustify } from 'lucide-react';
import { EnhancedProjectData } from '../../types/project-wizard-types';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeCard } from '@/components/shared/ThemeCard';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EnhancedProjectConfigStepProps {
  data: EnhancedProjectData;
  updateData: (data: Partial<EnhancedProjectData>) => void;
}

export function EnhancedProjectConfigStep({ data, updateData }: EnhancedProjectConfigStepProps) {
  const { isDark } = useTheme();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  
  // Project format options
  const formatOptions = [
    {
      value: 'Textbook',
      label: 'Textbook',
      description: 'Traditional comprehensive educational book'
    },
    {
      value: 'TeachersGuide',
      label: 'Teacher\'s Guide',
      description: 'Supplementary materials for instructors'
    },
    {
      value: 'Workbook',
      label: 'Workbook',
      description: 'Practice exercises and activities'
    },
    {
      value: 'Curriculum',
      label: 'Curriculum',
      description: 'Complete educational program'
    },
    {
      value: 'InteractiveModule',
      label: 'Interactive Module',
      description: 'Engagement-focused learning materials'
    },
    {
      value: 'Custom',
      label: 'Custom Format',
      description: 'Define your own project format'
    }
  ];
  
  // Subject categories
  const subjectCategories = [
    {
      name: 'Languages',
      subjects: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'ESL/EFL']
    },
    {
      name: 'STEM',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Engineering', 'Environmental Science']
    },
    {
      name: 'Humanities',
      subjects: ['History', 'Geography', 'Philosophy', 'Literature', 'Art History', 'Music', 'Religious Studies']
    },
    {
      name: 'Social Sciences',
      subjects: ['Psychology', 'Sociology', 'Economics', 'Political Science', 'Anthropology', 'Archaeology']
    },
    {
      name: 'Professional',
      subjects: ['Business', 'Law', 'Medicine', 'Education', 'Communication', 'Leadership', 'Marketing']
    }
  ];
  
  // Education levels
  const educationLevels = [
    { value: 'Preschool', label: 'Preschool', ageRange: 'Ages 3-5' },
    { value: 'Elementary', label: 'Elementary School', ageRange: 'Ages 6-10' },
    { value: 'MiddleSchool', label: 'Middle School', ageRange: 'Ages 11-13' },
    { value: 'HighSchool', label: 'High School', ageRange: 'Ages 14-18' },
    { value: 'College', label: 'College/University', ageRange: 'Ages 18+' },
    { value: 'Adult', label: 'Adult Education', ageRange: 'Ages 18+' },
    { value: 'Professional', label: 'Professional Development', ageRange: 'Working Professionals' },
  ];
  
  // Pedagogy approaches
  const pedagogyApproaches = [
    {
      value: 'Standard',
      label: 'Standard',
      description: 'Traditional teaching methods with structured learning paths'
    },
    {
      value: 'Constructivist',
      label: 'Constructivist',
      description: 'Learners build knowledge through experiences and reflection'
    },
    {
      value: 'ProjectBased',
      label: 'Project-Based',
      description: 'Learning through extended projects and practical challenges'
    },
    {
      value: 'Flipped',
      label: 'Flipped Classroom',
      description: 'Self-study content followed by collaborative activities'
    },
    {
      value: 'Inquiry',
      label: 'Inquiry-Based',
      description: 'Learning driven by questions, investigation, and discovery'
    },
    {
      value: 'Gamified',
      label: 'Gamified',
      description: 'Using game elements to enhance engagement and motivation'
    },
    {
      value: 'Custom',
      label: 'Custom Approach',
      description: 'Define your own teaching approach'
    },
  ];
  
  // Handle subject selection
  const handleAddSubject = () => {
    if (!selectedSubject) return;
    
    if (selectedSubject === 'custom' && customSubject.trim()) {
      updateData({ 
        subjects: [...data.subjects, customSubject.trim()] 
      });
      setCustomSubject('');
    } else if (selectedSubject !== 'custom' && !data.subjects.includes(selectedSubject)) {
      updateData({ 
        subjects: [...data.subjects, selectedSubject] 
      });
    }
    
    setSelectedSubject('');
  };
  
  const handleRemoveSubject = (subject: string) => {
    updateData({
      subjects: data.subjects.filter(s => s !== subject)
    });
  };
  
  // Handle level selection
  const handleLevelChange = (level: string) => {
    const currentLevels = [...data.levels];
    if (currentLevels.includes(level)) {
      updateData({ levels: currentLevels.filter(l => l !== level) });
    } else {
      updateData({ levels: [...currentLevels, level] });
    }
  };

  return (
    <div className="space-y-8">
      {/* Project Format */}
      <div className="space-y-4">
        <div className="flex items-center">
          <Book className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Project Format
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                The type of educational content you want to create
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <RadioGroup 
          value={data.projectType}
          onValueChange={(value) => updateData({ projectType: value })}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {formatOptions.map(option => (
            <div key={option.value} className="relative">
              <RadioGroupItem 
                value={option.value} 
                id={`format-${option.value}`}
                className="absolute opacity-0"
              />
              <Label
                htmlFor={`format-${option.value}`}
                className={`block rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                  data.projectType === option.value 
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
        
        {data.projectType === 'Custom' && (
          <div className="space-y-2 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800 mt-2">
            <Label htmlFor="custom-format" className={isDark ? 'text-white' : 'text-gray-900'}>
              Define Custom Format
            </Label>
            <Input
              id="custom-format"
              value={data.customProjectType}
              onChange={(e) => updateData({ customProjectType: e.target.value })}
              placeholder="Enter custom project format"
            />
          </div>
        )}
      </div>
      
      {/* Subject Areas */}
      <div className="space-y-4">
        <div className="flex items-center">
          <BookType className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Subject Areas
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Select one or more subjects for your educational content
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <ThemeCard className="p-3">
              <div className="space-y-3">
                <Label htmlFor="subject-select">Add Subject</Label>
                <div className="flex space-x-2">
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger id="subject-select" className="flex-1">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectCategories.map(category => (
                        <React.Fragment key={category.name}>
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                            {category.name}
                          </div>
                          {category.subjects.map(subject => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                          <Separator className="my-1" />
                        </React.Fragment>
                      ))}
                      <SelectItem value="custom">Custom Subject...</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={handleAddSubject}
                    disabled={!selectedSubject}
                  >
                    Add
                  </Button>
                </div>
                
                {selectedSubject === 'custom' && (
                  <Input
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Enter custom subject"
                    className="mt-2"
                  />
                )}
              </div>
            </ThemeCard>
          </div>
          
          <div>
            <Label className="block mb-2">Selected Subjects:</Label>
            {data.subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.subjects.map(subject => (
                  <Badge 
                    key={subject}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {subject}
                    <button 
                      type="button"
                      onClick={() => handleRemoveSubject(subject)}
                      className="ml-1 text-xs hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No subjects selected</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Target Audience */}
      <div className="space-y-4">
        <div className="flex items-center">
          <GraduationCap className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Target Audience Levels
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Select one or more educational levels for your intended audience
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {educationLevels.map(level => (
            <div key={level.value} className="flex items-center space-x-2">
              <Checkbox
                id={`level-${level.value}`}
                checked={data.levels.includes(level.value)}
                onCheckedChange={() => handleLevelChange(level.value)}
                className="data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
              />
              <div>
                <Label 
                  htmlFor={`level-${level.value}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {level.label}
                </Label>
                <p className="text-xs text-muted-foreground">{level.ageRange}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Teaching Approach */}
      <div className="space-y-4">
        <div className="flex items-center">
          <FileType className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Teaching Approach
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                The pedagogical approach that guides your content design
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <RadioGroup 
          value={data.pedagogy}
          onValueChange={(value) => updateData({ pedagogy: value })}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {pedagogyApproaches.map(option => (
            <div key={option.value} className="relative">
              <RadioGroupItem 
                value={option.value} 
                id={`pedagogy-${option.value}`}
                className="absolute opacity-0"
              />
              <Label
                htmlFor={`pedagogy-${option.value}`}
                className={`block rounded-lg border-2 p-3 cursor-pointer transition-colors ${
                  data.pedagogy === option.value 
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
        
        {data.pedagogy === 'Custom' && (
          <div className="space-y-2 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800 mt-2">
            <Label htmlFor="custom-pedagogy" className={isDark ? 'text-white' : 'text-gray-900'}>
              Define Custom Pedagogy Approach
            </Label>
            <Input
              id="custom-pedagogy"
              value={data.customPedagogy}
              onChange={(e) => updateData({ customPedagogy: e.target.value })}
              placeholder="Describe your teaching approach"
            />
          </div>
        )}
      </div>
      
      {/* Content Scope & Length */}
      <div className="space-y-4">
        <div className="flex items-center">
          <AlignJustify className={`mr-2 h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Content Scope & Length
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Define the approximate size and distribution of your content
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <ThemeCard className="p-4">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="word-count" className="font-medium">
                  Target Word Count
                </Label>
                <span className="text-sm font-medium">
                  {data.wordCount.toLocaleString()} words
                </span>
              </div>
              <Slider
                id="word-count"
                min={1000}
                max={50000}
                step={1000}
                value={[data.wordCount]}
                onValueChange={(values) => updateData({ wordCount: values[0] })}
                className={`${isDark ? 'bg-slate-800' : ''}`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1,000</span>
                <span>25,000</span>
                <span>50,000</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="font-medium">Word Distribution</Label>
              <RadioGroup 
                value={data.wordDistribution}
                onValueChange={(value) => updateData({ wordDistribution: value })}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="front-loaded" id="distribution-front" />
                  <Label htmlFor="distribution-front">Front-loaded (more content early)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="balanced" id="distribution-balanced" />
                  <Label htmlFor="distribution-balanced">Balanced (even distribution)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="back-loaded" id="distribution-back" />
                  <Label htmlFor="distribution-back">Back-loaded (more content later)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-3">
              <Label className="font-medium">Word Count Enforcement</Label>
              <RadioGroup 
                value={data.wordEnforcement}
                onValueChange={(value) => updateData({ wordEnforcement: value })}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="strict" id="enforcement-strict" />
                  <Label htmlFor="enforcement-strict">Strict (adhere closely to target)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flexible" id="enforcement-flexible" />
                  <Label htmlFor="enforcement-flexible">Flexible (allow reasonable variations)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minimum" id="enforcement-minimum" />
                  <Label htmlFor="enforcement-minimum">Minimum (treat target as lower bound)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </ThemeCard>
      </div>
    </div>
  );
}
