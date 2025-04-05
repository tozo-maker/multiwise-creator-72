
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PedagogySelectorProps {
  pedagogy: string;
  onPedagogyChange: (value: string) => void;
}

export const PedagogySelector: React.FC<PedagogySelectorProps> = ({
  pedagogy,
  onPedagogyChange
}) => {
  const [customPedagogy, setCustomPedagogy] = useState('');

  const handlePedagogyChange = (value: string) => {
    onPedagogyChange(value);
  };

  const handleCustomPedagogyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPedagogy(e.target.value);
    onPedagogyChange('Custom: ' + e.target.value);
  };

  return (
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
        value={pedagogy.startsWith('Custom:') ? 'Custom' : pedagogy} 
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
      
      {pedagogy === 'Custom' || pedagogy.startsWith('Custom:') ? (
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
  );
};
