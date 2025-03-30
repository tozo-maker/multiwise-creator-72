
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Trash2, 
  Send, 
  Copy, 
  Check,
  Bot,
  User,
  ThumbsUp, 
  ThumbsDown,
  Loader2,
  DownloadCloud,
  RefreshCcw,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AiChatInterfaceProps {
  contextFiles?: Array<{ name: string; content?: string }>;
  initialPrompt?: string;
  onContentGenerated?: (content: string) => void;
}

export const AiChatInterface = ({ 
  contextFiles = [], 
  initialPrompt = '',
  onContentGenerated
}: AiChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
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
  
  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
            <Sparkles className="h-4 w-4 text-brand-600" />
          </div>
          <div>
            <h3 className="font-medium">AI Content Assistant</h3>
            <p className="text-xs text-slate-500">Creating educational content with AI</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-500">
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
                <Button variant="ghost" size="icon" className="text-slate-500">
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
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {contextFiles.length > 0 && (
          <div className="text-xs text-slate-500 bg-slate-100 p-2 rounded-md">
            Using {contextFiles.length} file(s) as context: {contextFiles.map(f => f.name).join(', ')}
          </div>
        )}
        
        {messages.length === 0 && (
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
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card 
              className={`max-w-[85%] ${
                message.role === 'user' 
                  ? 'bg-brand-100 border-brand-200' 
                  : 'bg-white'
              }`}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex space-x-2 items-start mb-2">
                  <div 
                    className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-100'
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
                      <p className="text-xs font-medium">
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Intl.DateTimeFormat('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        }).format(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm whitespace-pre-line">
                  {formatMessage(message.content)}
                </div>
                
                {message.role === 'assistant' && (
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-slate-600 hover:text-brand-600"
                        onClick={() => handleFeedback(true)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-slate-600 hover:text-destructive"
                        onClick={() => handleFeedback(false)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Not helpful
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-slate-600"
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
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <Card className="max-w-[85%] bg-white">
              <CardContent className="p-3 sm:p-4">
                <div className="flex space-x-2 items-start">
                  <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-medium">AI Assistant</p>
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your instructions for content generation..."
            className="w-full resize-none pr-24"
            rows={isMobile ? 3 : 2}
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
              onClick={() => handleSendMessage()}
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
    </div>
  );
};
