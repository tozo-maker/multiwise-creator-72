
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <Card className="max-w-[85%] bg-white dark:bg-slate-800 dark:border-slate-700">
        <CardContent className="p-3 sm:p-4">
          <div className="flex space-x-2 items-start">
            <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
              <Bot className="h-3 w-3" />
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-medium dark:text-slate-300">AI Assistant</p>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
