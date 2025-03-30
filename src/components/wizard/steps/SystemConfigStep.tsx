
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SystemConfigProps {
  data: {
    interfaceLanguage: string;
    experienceLevel: string;
    interactionMode: string;
    outputDetail: string;
    systemBehavior: string;
  };
  updateData: (data: Partial<{
    interfaceLanguage: string;
    experienceLevel: string;
    interactionMode: string;
    outputDetail: string;
    systemBehavior: string;
  }>) => void;
}

export const SystemConfigStep: React.FC<SystemConfigProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="interfaceLanguage">Interface Language</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">The language of the application interface (not the generated content)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={data.interfaceLanguage} 
          onValueChange={(value) => updateData({ interfaceLanguage: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select interface language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Chinese">Chinese</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="experienceLevel">Your Experience Level</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">This helps customize the interface and guidance to your expertise level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={data.experienceLevel} 
          onValueChange={(value) => updateData({ experienceLevel: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
            <SelectItem value="Expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="interactionMode">Interaction Mode</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">How much guidance you prefer while using the system</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={data.interactionMode} 
          onValueChange={(value) => updateData({ interactionMode: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select interaction mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Guided">Guided (Step-by-step assistance)</SelectItem>
            <SelectItem value="Standard">Standard (Balanced guidance)</SelectItem>
            <SelectItem value="Advanced">Advanced (Minimal guidance)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="outputDetail">AI Output Detail</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">Controls how detailed the AI-generated responses will be</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={data.outputDetail} 
          onValueChange={(value) => updateData({ outputDetail: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select output detail" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Concise">Concise (Brief outputs)</SelectItem>
            <SelectItem value="Balanced">Balanced</SelectItem>
            <SelectItem value="Detailed">Detailed (Comprehensive outputs)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="systemBehavior">System Behavior</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">How proactive the system should be in suggesting improvements</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={data.systemBehavior} 
          onValueChange={(value) => updateData({ systemBehavior: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select system behavior" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Conservative">Conservative (Minimal suggestions)</SelectItem>
            <SelectItem value="Balanced">Balanced</SelectItem>
            <SelectItem value="Proactive">Proactive (Frequent suggestions)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
