import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle, Plus, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface ProjectConfigProps {
  data: {
    projectType: string;
    subjects: string[];
    levels: string[];
    pedagogy: string;
    wordCount: number;
  };
  updateData: (data: Partial<{
    projectType: string;
    subjects: string[];
    levels: string[];
    pedagogy: string;
    wordCount: number;
  }>) => void;
}

export const ProjectConfigStep: React.FC<ProjectConfigProps> = ({ data, updateData }) => {
  const [newSubject, setNewSubject] = useState('');
  const [newLevel, setNewLevel] = useState('');
  const [customProjectType, setCustomProjectType] = useState('');
  const [customPedagogy, setCustomPedagogy] = useState('');

  const addSubject = () => {
    if (newSubject.trim() !== '' && !data.subjects.includes(newSubject.trim())) {
      updateData({ subjects: [...data.subjects, newSubject.trim()] });
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    updateData({ subjects: data.subjects.filter(s => s !== subject) });
  };

  const addLevel = () => {
    if (newLevel.trim() !== '' && !data.levels.includes(newLevel.trim())) {
      updateData({ levels: [...data.levels, newLevel.trim()] });
      setNewLevel('');
    }
  };

  const removeLevel = (level: string) => {
    updateData({ levels: data.levels.filter(l => l !== level) });
  };

  const handleProjectTypeChange = (value: string) => {
    updateData({ projectType: value });
    if (value !== 'Custom') {
      setCustomProjectType('');
    }
  };

  const handlePedagogyChange = (value: string) => {
    updateData({ pedagogy: value });
    if (value !== 'Custom') {
      setCustomPedagogy('');
    }
  };

  const handleCustomProjectTypeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomProjectType(e.target.value);
    updateData({ projectType: 'Custom: ' + e.target.value });
  };

  const handleCustomPedagogyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPedagogy(e.target.value);
    updateData({ pedagogy: 'Custom: ' + e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="projectType">Project Type</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">The type of educational material you want to create</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={data.projectType.startsWith('Custom:') ? 'Custom' : data.projectType} 
          onValueChange={handleProjectTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Textbook">Textbook</SelectItem>
            <SelectItem value="Lesson Plan">Lesson Plan</SelectItem>
            <SelectItem value="Workbook">Workbook</SelectItem>
            <SelectItem value="Teacher Guide">Teacher Guide</SelectItem>
            <SelectItem value="Assessment">Assessment</SelectItem>
            <SelectItem value="Custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        
        {data.projectType === 'Custom' || data.projectType.startsWith('Custom:') ? (
          <div className="mt-2">
            <Label htmlFor="customProjectType" className="text-sm">Specify Custom Project Type</Label>
            <Textarea 
              id="customProjectType"
              placeholder="Describe your custom project type..."
              value={customProjectType}
              onChange={handleCustomProjectTypeChange}
              className="mt-1"
            />
          </div>
        ) : null}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="subjects">Subjects</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">The academic subjects covered in your project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2">
          <Input 
            id="newSubject" 
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Add a subject"
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={addSubject}
            disabled={newSubject.trim() === ''}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.subjects.length === 0 && (
            <div className="text-sm text-slate-500">No subjects added yet</div>
          )}
          {data.subjects.map((subject, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {subject}
              <button 
                onClick={() => removeSubject(subject)}
                className="ml-1 text-slate-400 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="levels">Educational Levels</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">The educational levels targeted by your content</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2">
          <Input 
            id="newLevel" 
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
            placeholder="Add an educational level"
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={addLevel}
            disabled={newLevel.trim() === ''}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.levels.length === 0 && (
            <div className="text-sm text-slate-500">No levels added yet</div>
          )}
          {data.levels.map((level, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {level}
              <button 
                onClick={() => removeLevel(level)}
                className="ml-1 text-slate-400 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="pedagogy">Pedagogical Approach</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">The teaching philosophy or methodology you prefer</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={data.pedagogy.startsWith('Custom:') ? 'Custom' : data.pedagogy} 
          onValueChange={handlePedagogyChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select pedagogical approach" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Standard">Standard</SelectItem>
            <SelectItem value="Project-Based">Project-Based Learning</SelectItem>
            <SelectItem value="Inquiry-Based">Inquiry-Based Learning</SelectItem>
            <SelectItem value="Flipped Classroom">Flipped Classroom</SelectItem>
            <SelectItem value="Montessori">Montessori</SelectItem>
            <SelectItem value="Custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        
        {data.pedagogy === 'Custom' || data.pedagogy.startsWith('Custom:') ? (
          <div className="mt-2">
            <Label htmlFor="customPedagogy" className="text-sm">Specify Custom Pedagogical Approach</Label>
            <Textarea 
              id="customPedagogy"
              placeholder="Describe your custom pedagogical approach..."
              value={customPedagogy}
              onChange={handleCustomPedagogyChange}
              className="mt-1"
            />
          </div>
        ) : null}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="wordCount">Target Word Count</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">Estimated word count for the entire project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input 
          id="wordCount" 
          type="number"
          value={data.wordCount.toString()}
          onChange={(e) => updateData({ wordCount: parseInt(e.target.value) || 0 })}
          min="0"
          step="1000"
        />
      </div>
    </div>
  );
};
