
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ConfigData } from '@/components/wizard/types';

interface SystemConfigTabProps {
  configData: ConfigData;
  updateConfigData: (data: Partial<ConfigData>) => void;
}

export const SystemConfigTab: React.FC<SystemConfigTabProps> = ({ configData, updateConfigData }) => {
  return (
    <div className="text-slate-300">
      <p className="mb-6">Configure how you want to interact with the system and how it should respond to you.</p>
    
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="interfaceLanguage" className="text-slate-300">Interface Language</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Language used for the interface elements</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select 
            defaultValue={configData.interfaceLanguage}
            onValueChange={(value) => updateConfigData({ interfaceLanguage: value })}
          >
            <SelectTrigger id="interfaceLanguage" className="bg-slate-800 border-slate-600 text-slate-200 w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-slate-300">User Experience Level</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your level of experience with educational content creation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup 
            defaultValue={configData.experienceLevel} 
            onValueChange={(value) => updateConfigData({ experienceLevel: value })}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <div className="flex flex-col bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Beginner" id="beginner" />
                <Label htmlFor="beginner" className="font-medium text-slate-200 cursor-pointer">Beginner</Label>
              </div>
              <p className="text-xs text-slate-400 mt-1">I'm new to creating educational materials</p>
            </div>
            
            <div className="flex flex-col bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="font-medium text-slate-200 cursor-pointer">Intermediate</Label>
              </div>
              <p className="text-xs text-slate-400 mt-1">I have some experience with content creation</p>
            </div>
            
            <div className="flex flex-col bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Advanced" id="advanced" />
                <Label htmlFor="advanced" className="font-medium text-slate-200 cursor-pointer">Advanced</Label>
              </div>
              <p className="text-xs text-slate-400 mt-1">I'm experienced in educational content development</p>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-slate-300">Interaction Mode</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>How you prefer to interact with the system</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup 
            defaultValue={configData.interactionMode || "Guided"} 
            onValueChange={(value) => updateConfigData({ interactionMode: value })}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer">
              <RadioGroupItem value="Conversational" id="conversational" />
              <div>
                <Label htmlFor="conversational" className="font-medium text-slate-200 cursor-pointer">Conversational</Label>
                <p className="text-xs text-slate-400 mt-1">Interact through natural dialogue</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer">
              <RadioGroupItem value="Structured" id="structured" />
              <div>
                <Label htmlFor="structured" className="font-medium text-slate-200 cursor-pointer">Structured</Label>
                <p className="text-xs text-slate-400 mt-1">Guided form-based interaction</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer">
              <RadioGroupItem value="Direct" id="direct" />
              <div>
                <Label htmlFor="direct" className="font-medium text-slate-200 cursor-pointer">Direct</Label>
                <p className="text-xs text-slate-400 mt-1">Minimal interaction, focus on results</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer">
              <RadioGroupItem value="Collaborative" id="collaborative" />
              <div>
                <Label htmlFor="collaborative" className="font-medium text-slate-200 cursor-pointer">Collaborative</Label>
                <p className="text-xs text-slate-400 mt-1">Iterative back-and-forth approach</p>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="outputDetail" className="text-slate-300">Output Detail Level</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Level of detail in system responses</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select 
            defaultValue={configData.outputDetail}
            onValueChange={(value) => updateConfigData({ outputDetail: value })}
          >
            <SelectTrigger id="outputDetail" className="bg-slate-800 border-slate-600 text-slate-200 w-full">
              <SelectValue placeholder="Select detail level" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
              <SelectItem value="Detailed">Detailed - Comprehensive explanations</SelectItem>
              <SelectItem value="Balanced">Balanced - Moderate detail</SelectItem>
              <SelectItem value="Concise">Concise - Brief outputs</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="systemBehavior" className="text-slate-300">System Behavior Style</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>How the system should behave when generating content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select 
            defaultValue={configData.systemBehavior}
            onValueChange={(value) => updateConfigData({ systemBehavior: value })}
          >
            <SelectTrigger id="systemBehavior" className="bg-slate-800 border-slate-600 text-slate-200 w-full">
              <SelectValue placeholder="Select behavior style" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
              <SelectItem value="Creative">Creative - More innovative outputs</SelectItem>
              <SelectItem value="Balanced">Balanced - Mix of creativity and precision</SelectItem>
              <SelectItem value="Precise">Precise - Focus on accuracy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
