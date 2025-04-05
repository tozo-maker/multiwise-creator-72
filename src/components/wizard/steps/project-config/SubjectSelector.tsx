
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Plus, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SubjectSelectorProps {
  subjects: string[];
  onSubjectsChange: (subjects: string[]) => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  subjects,
  onSubjectsChange
}) => {
  const [newSubject, setNewSubject] = useState('');

  const addSubject = () => {
    if (newSubject.trim() !== '' && !subjects.includes(newSubject.trim())) {
      onSubjectsChange([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    onSubjectsChange(subjects.filter(s => s !== subject));
  };

  return (
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
        {subjects.length === 0 && (
          <div className="text-sm text-slate-500">No subjects added yet</div>
        )}
        {subjects.map((subject, index) => (
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
  );
};
