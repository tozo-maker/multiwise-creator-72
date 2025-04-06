
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';

interface WordCountInputProps {
  wordCount: number;
  onWordCountChange: (value: number) => void;
  distribution?: string;
  enforcement?: string;
  onDistributionChange?: (value: string) => void;
  onEnforcementChange?: (value: string) => void;
}

export const WordCountInput: React.FC<WordCountInputProps> = ({
  wordCount,
  onWordCountChange,
  distribution = 'balanced',
  enforcement = 'flexible',
  onDistributionChange,
  onEnforcementChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="wordCount">A. Target Word Count</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">Estimated total word count for the entire project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-4">
          <Slider
            defaultValue={[wordCount]}
            max={50000}
            step={1000}
            onValueChange={(values) => onWordCountChange(values[0])}
            className="flex-1"
          />
          <Input 
            id="wordCount" 
            type="number"
            value={wordCount.toString()}
            onChange={(e) => onWordCountChange(parseInt(e.target.value) || 0)}
            min="0"
            step="1000"
            className="w-24"
          />
        </div>
        <div className="text-xs text-slate-500">
          {wordCount < 5000 ? 'Short' : wordCount < 15000 ? 'Medium' : 'Long'} content 
          ({Math.round(wordCount/250)} minutes to read)
        </div>
      </div>

      {/* Word Count Distribution */}
      {onDistributionChange && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>B. Word Count Distribution</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-80">How words should be distributed across different sections</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup 
            value={distribution}
            onValueChange={(value) => onDistributionChange(value)}
            className="grid grid-cols-1 gap-2"
          >
            <Card className={`border p-0 cursor-pointer ${distribution === 'balanced' ? 'border-brand-400 bg-brand-50' : 'border-slate-200'}`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="balanced" id="balanced" />
                  <div>
                    <Label htmlFor="balanced" className="font-medium cursor-pointer">Balanced</Label>
                    <p className="text-xs text-slate-500">Even distribution across all sections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`border p-0 cursor-pointer ${distribution === 'front-loaded' ? 'border-brand-400 bg-brand-50' : 'border-slate-200'}`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="front-loaded" id="front-loaded" />
                  <div>
                    <Label htmlFor="front-loaded" className="font-medium cursor-pointer">Front-loaded</Label>
                    <p className="text-xs text-slate-500">More content in earlier sections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`border p-0 cursor-pointer ${distribution === 'back-loaded' ? 'border-brand-400 bg-brand-50' : 'border-slate-200'}`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="back-loaded" id="back-loaded" />
                  <div>
                    <Label htmlFor="back-loaded" className="font-medium cursor-pointer">Back-loaded</Label>
                    <p className="text-xs text-slate-500">More content in later sections</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border p-0 cursor-pointer ${distribution === 'ai-determined' ? 'border-brand-400 bg-brand-50' : 'border-slate-200'}`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="ai-determined" id="ai-determined" />
                  <div>
                    <Label htmlFor="ai-determined" className="font-medium cursor-pointer">AI-Determined</Label>
                    <p className="text-xs text-slate-500">Let AI decide based on project needs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        </div>
      )}

      {/* Word Count Enforcement */}
      {onEnforcementChange && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>C. Word Count Enforcement</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-80">How strictly to follow the target word count</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup 
            value={enforcement}
            onValueChange={(value) => onEnforcementChange(value)}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="strict" id="strict" />
              <Label htmlFor="strict" className="cursor-pointer">Strict</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="flexible" id="flexible" />
              <Label htmlFor="flexible" className="cursor-pointer">Flexible</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="suggested" id="suggested" />
              <Label htmlFor="suggested" className="cursor-pointer">Suggested only</Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
};
