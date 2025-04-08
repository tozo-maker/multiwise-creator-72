
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Bot, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { Message } from './types';
import { useToast } from "@/components/ui/use-toast";

interface ChatMessageProps {
  message: Message;
  handleFeedback: (isPositive: boolean) => void;
  formatMessage: (content: string) => React.ReactNode;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  handleFeedback,
  formatMessage
}) => {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
      
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied to your clipboard.",
        duration: 2000,
      });
    });
  };

  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <Card 
        className={`max-w-[85%] ${
          message.role === 'user' 
            ? 'bg-brand-100 border-brand-200 dark:bg-brand-900/30 dark:border-brand-700/30' 
            : 'bg-white dark:bg-slate-800 dark:border-slate-700'
        }`}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex space-x-2 items-start mb-2">
            <div 
              className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-brand-500 text-white dark:bg-brand-600'
                  : 'bg-slate-100 dark:bg-slate-700'
              }`}
            >
              {message.role === 'user' ? (
                <User className="h-3 w-3" />
              ) : (
                <Bot className="h-3 w-3" />
              )}
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-start">
                <p className="text-xs font-medium dark:text-slate-300">
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-sm whitespace-pre-line dark:text-slate-300">
            {formatMessage(message.content)}
          </div>
          
          {message.role === 'assistant' && (
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                  onClick={() => handleFeedback(true)}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-slate-600 hover:text-destructive dark:text-slate-400 dark:hover:text-destructive"
                  onClick={() => handleFeedback(false)}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Not helpful
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-slate-600 dark:text-slate-400"
                onClick={() => copyToClipboard(message.content, message.id)}
              >
                {copiedMessageId === message.id ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copiedMessageId === message.id ? 'Copied' : 'Copy'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
