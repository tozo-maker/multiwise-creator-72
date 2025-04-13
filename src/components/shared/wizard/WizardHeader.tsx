
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useWizard } from '@/contexts/WizardContext';
import { useTheme } from '@/contexts/ThemeContext';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WizardHeaderProps {
  title?: string;
  description?: string;
  stepTitles?: Record<number, string>;
  stepDescriptions?: Record<number, string>;
  stepHelp?: Record<number, string>;
}

export function WizardHeader({ 
  title, 
  description,
  stepTitles,
  stepDescriptions,
  stepHelp
}: WizardHeaderProps) {
  const { currentStep, steps } = useWizard();
  const { isDark } = useTheme();
  
  const currentStepName = steps[currentStep]?.name;
  const stepTitle = stepTitles?.[currentStep];
  const stepDescription = stepDescriptions?.[currentStep];
  const stepHelpText = stepHelp?.[currentStep];
  
  const displayTitle = stepTitle || title;
  const displayDescription = stepDescription || description;

  return (
    <CardHeader className={`${isDark ? 'border-slate-700' : 'border-slate-200'} border-b relative`}>
      {currentStepName && (
        <div className="text-sm font-medium text-brand-500 dark:text-brand-400 mb-1">
          Step {currentStep + 1}: {currentStepName}
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {displayTitle && (
            <CardTitle className={`${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {displayTitle}
            </CardTitle>
          )}
          
          {displayDescription && (
            <CardDescription className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
              {displayDescription}
            </CardDescription>
          )}
        </div>
        
        {stepHelpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className={`ml-2 text-slate-400 hover:text-slate-600 ${isDark ? 'hover:text-slate-300' : ''} transition-colors`}
                  aria-label="Help"
                >
                  <HelpCircle size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                {stepHelpText}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </CardHeader>
  );
}
