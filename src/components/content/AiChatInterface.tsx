
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import { Message, ContextFile } from './chat/types';
import { ChatHeader } from './chat/ChatHeader';
import { ChatEmptyState } from './chat/ChatEmptyState';
import { ChatInput } from './chat/ChatInput';
import { ChatMessage } from './chat/ChatMessage';
import { TypingIndicator } from './chat/TypingIndicator';
import { ContextFilesBar } from './chat/ContextFilesBar';

interface AiChatInterfaceProps {
  contextFiles?: ContextFile[];
  initialPrompt?: string;
  onContentGenerated?: (content: string) => void;
}

export const AiChatInterface: React.FC<AiChatInterfaceProps> = ({ 
  contextFiles = [], 
  initialPrompt = '',
  onContentGenerated
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // If there's an initial prompt, auto-send it
    if (initialPrompt && messages.length === 0) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (message: string = input) => {
    if (!message.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Mock AI response (simulate API call delay)
    setTimeout(() => {
      const responseContent = generateMockResponse(message);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      if (onContentGenerated) {
        onContentGenerated(responseContent);
      }
    }, 1500);
  };
  
  const generateMockResponse = (message: string) => {
    // This is just a mock function to generate a response
    // In a real app, this would be an API call to your AI model
    const responses = [
      "Here's a draft of the educational content you requested. I've structured it with clear learning objectives and included examples based on your requirements.",
      "I've generated a lesson plan that incorporates the teaching methodology you specified. The content includes interactive exercises and assessment questions.",
      "Based on the reference materials you provided, I've created educational content that aligns with the curriculum standards while maintaining an engaging tone for students."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return `${randomResponse}\n\n${generateLoremIpsum(3)}`;
  };
  
  const generateLoremIpsum = (paragraphs: number) => {
    const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies ultricies, nunc nisl aliquam nunc, eget aliquam nisl nisl sit amet nisl. Nullam auctor, nisl ac ultricies ultricies, nunc nisl aliquam nunc, eget aliquam nisl nisl sit amet nisl.

Vivamus eget justo euismod, tincidunt metus eget, ultricies orci. Nullam auctor, nisl ac ultricies ultricies, nunc nisl aliquam nunc, eget aliquam nisl nisl sit amet nisl.

Praesent ac magna at metus malesuada tincidunt. Nullam auctor, nisl ac ultricies ultricies, nunc nisl aliquam nunc, eget aliquam nisl nisl sit amet nisl.`;
    
    return lorem.split('\n\n').slice(0, paragraphs).join('\n\n');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatMessage = (content: string) => {
    // Replace newlines with <br> tags for HTML rendering
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };
  
  const handleFeedback = (isPositive: boolean) => {
    toast({
      title: isPositive ? "Positive feedback sent" : "Negative feedback sent",
      description: isPositive 
        ? "Thank you for your positive feedback!" 
        : "Thank you for your feedback. We'll work to improve this.",
      duration: 3000,
    });
  };

  const resetConversation = () => {
    setMessages([]);
    setInput('');
    setIsTyping(false);
  };

  const exportConversation = () => {
    // Create a text version of the conversation
    const conversationText = messages
      .map(msg => `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`)
      .join('\n\n');
    
    // Create a blob and download it
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-conversation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Conversation exported",
      description: "Your conversation has been downloaded as a text file.",
      duration: 3000,
    });
  };
  
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
      <ChatHeader 
        resetConversation={resetConversation}
        exportConversation={exportConversation}
      />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <ContextFilesBar contextFiles={contextFiles} />
        
        {messages.length === 0 ? (
          <ChatEmptyState setInput={setInput} />
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage 
                key={message.id}
                message={message}
                handleFeedback={handleFeedback}
                formatMessage={formatMessage}
              />
            ))}
            
            {isTyping && <TypingIndicator />}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput
        input={input}
        setInput={setInput}
        handleSendMessage={() => handleSendMessage()}
        handleKeyPress={handleKeyPress}
        isTyping={isTyping}
      />
    </div>
  );
};
