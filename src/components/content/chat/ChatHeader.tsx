
import React from 'react';
import { Sparkles, RefreshCcw, DownloadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatHeaderProps {
  resetConversation?: () => void;
  exportConversation?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  resetConversation,
  exportConversation
}) => {
  return (
    <div className="p-4 border-b border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 flex justify-between items-center">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mr-3">
          <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h3 className="font-medium dark:text-slate-100">AI Content Assistant</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Creating educational content with AI</p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-500 dark:text-slate-400"
                onClick={resetConversation}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset conversation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-500 dark:text-slate-400"
                onClick={exportConversation}
              >
                <DownloadCloud className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export conversation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
