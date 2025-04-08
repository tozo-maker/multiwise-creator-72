
import React from 'react';
import { Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatEmptyStateProps {
  setInput: (value: string) => void;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({ setInput }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6">
      <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
        <Bot className="h-6 w-6 text-brand-600" />
      </div>
      <h3 className="text-lg font-medium mb-2">Content Generation Assistant</h3>
      <p className="text-slate-500 max-w-md mb-6">
        Ask me to generate educational content, create lesson plans, or adapt materials for different learning levels.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-lg">
        <Button 
          variant="outline" 
          className="justify-start" 
          onClick={() => setInput("Create a lesson plan for teaching Spanish past tense to beginners.")}
        >
          Create a lesson plan...
        </Button>
        <Button 
          variant="outline" 
          className="justify-start" 
          onClick={() => setInput("Write a vocabulary section for intermediate French learners.")}
        >
          Write a vocabulary section...
        </Button>
        <Button 
          variant="outline" 
          className="justify-start" 
          onClick={() => setInput("Generate 10 practice exercises for German grammar.")}
        >
          Generate practice exercises...
        </Button>
        <Button 
          variant="outline" 
          className="justify-start" 
          onClick={() => setInput("Create an assessment quiz for Chinese characters.")}
        >
          Create an assessment quiz...
        </Button>
      </div>
    </div>
  );
};
