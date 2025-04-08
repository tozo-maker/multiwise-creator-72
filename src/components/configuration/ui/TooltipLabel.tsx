
import React from 'react';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TooltipLabelProps {
  htmlFor?: string;
  label: string;
  tooltip: string;
  className?: string;
}

export const TooltipLabel: React.FC<TooltipLabelProps> = ({
  htmlFor,
  label,
  tooltip,
  className = "text-slate-300"
}) => {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={htmlFor} className={className}>{label}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-slate-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
