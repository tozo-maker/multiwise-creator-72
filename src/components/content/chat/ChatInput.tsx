
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isTyping: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSendMessage,
  handleKeyPress,
  isTyping
}) => {
  return (
    <div className="p-4 border-t border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700">
      <div className="relative">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your instructions for content generation..."
          className="w-full resize-none pr-24 dark:bg-slate-800 dark:border-slate-700"
          rows={3}
        />
        <div className="absolute right-2 bottom-2 flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500"
            disabled={!input.trim()}
            onClick={() => setInput('')}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
          
          <Button
            size="sm"
            className="h-8"
            disabled={!input.trim() || isTyping}
            onClick={handleSendMessage}
          >
            {isTyping ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-1" />
            )}
            {isTyping ? 'Processing' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
};
