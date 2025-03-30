
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface LanguageConfigProps {
  data: {
    targetLanguage: string;
    goal: string;
    complexity: string;
    culturalIntegration: string;
    terminology: string;
    markers: string;
    standards: string;
    structure: string;
    formatting: string;
  };
  updateData: (data: Partial<{
    targetLanguage: string;
    goal: string;
    complexity: string;
    culturalIntegration: string;
    terminology: string;
    markers: string;
    standards: string;
    structure: string;
    formatting: string;
  }>) => void;
}

export const LanguageConfigStep: React.FC<LanguageConfigProps> = ({ data, updateData }) => {
  const showDocumentUploadAlert = data.standards === 'Custom';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="targetLanguage">Target Language</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">The language in which your content will be created</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={data.targetLanguage} 
          onValueChange={(value) => updateData({ targetLanguage: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select target language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Chinese">Chinese</SelectItem>
            <SelectItem value="Japanese">Japanese</SelectItem>
            <SelectItem value="Arabic">Arabic</SelectItem>
            <SelectItem value="Russian">Russian</SelectItem>
            <SelectItem value="Portuguese">Portuguese</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="goal">Primary Goal</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">The main purpose of your educational content</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={data.goal} 
          onValueChange={(value) => updateData({ goal: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select primary goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Teaching">Teaching/Instruction</SelectItem>
            <SelectItem value="Reference">Reference</SelectItem>
            <SelectItem value="Practice">Practice</SelectItem>
            <SelectItem value="Assessment">Assessment</SelectItem>
            <SelectItem value="Custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="complexity">Language Complexity</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">The linguistic complexity level of your content</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={data.complexity} 
          onValueChange={(value) => updateData({ complexity: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language complexity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner (A1-A2)</SelectItem>
            <SelectItem value="Intermediate">Intermediate (B1-B2)</SelectItem>
            <SelectItem value="Advanced">Advanced (C1-C2)</SelectItem>
            <SelectItem value="Mixed">Mixed (Adaptive)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="culturalIntegration">Cultural Integration</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">How much cultural context to include in your content</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={data.culturalIntegration} 
          onValueChange={(value) => updateData({ culturalIntegration: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select cultural integration level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Minimal">Minimal</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Extensive">Extensive</SelectItem>
            <SelectItem value="Custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="standards">Educational Standards</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">The curriculum standards to align with</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={data.standards} 
          onValueChange={(value) => updateData({ standards: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select educational standards" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Default">Default (General)</SelectItem>
            <SelectItem value="Common Core">Common Core (US)</SelectItem>
            <SelectItem value="CEFR">CEFR (European)</SelectItem>
            <SelectItem value="IB">International Baccalaureate</SelectItem>
            <SelectItem value="Custom">Custom (Upload Document)</SelectItem>
          </SelectContent>
        </Select>
        
        {showDocumentUploadAlert && (
          <Alert variant="default" className="bg-brand-50 text-brand-800 border-brand-200 mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You will be prompted to upload your custom standards document in the next step.
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="formatting">Formatting Style</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">The formatting and structure conventions to follow</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={data.formatting} 
          onValueChange={(value) => updateData({ formatting: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select formatting style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Default">Default</SelectItem>
            <SelectItem value="APA">APA</SelectItem>
            <SelectItem value="MLA">MLA</SelectItem>
            <SelectItem value="Chicago">Chicago</SelectItem>
            <SelectItem value="Custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
