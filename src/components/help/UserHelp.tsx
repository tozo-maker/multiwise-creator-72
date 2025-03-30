
import React, { useState } from 'react';
import { HelpCircle, X, Book, Maximize2, Minimize2, ChevronRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const HELP_TOPICS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn how to use MultiGuide to create educational content.',
    steps: [
      'Create a new project by clicking "New Project" on the dashboard.',
      'Configure your project settings including language and content type.',
      'Add knowledge base files to enhance your content generation.',
      'Generate content based on your configuration.',
      'Review and export your educational materials.'
    ]
  },
  {
    id: 'knowledge-base',
    title: 'Knowledge Base',
    description: 'Learn how to manage your knowledge base files.',
    steps: [
      'Navigate to the Knowledge Base tab in your project.',
      'Upload curriculum documents, style guides, and reference materials.',
      'Organize files with categories and tags for easy retrieval.',
      'Use the advanced search to quickly find documents.',
      'Reference knowledge base files when generating content.'
    ]
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    description: 'Generate educational content with AI assistance.',
    steps: [
      'Go to the Content tab in your project workspace.',
      'Define content parameters like chapter title, learning objectives, etc.',
      'Select the appropriate knowledge base references.',
      'Generate content with the AI assistant.',
      'Edit and refine the generated content as needed.'
    ]
  },
  {
    id: 'analysis',
    title: 'Content Analysis',
    description: 'Analyze your content for quality and standards alignment.',
    steps: [
      'Navigate to the Analysis tab in your project.',
      'Select the content you want to analyze.',
      'Choose analysis criteria (readability, standards alignment, etc.).',
      'Review the detailed analysis report.',
      'Make improvements based on the analysis feedback.'
    ]
  }
];

export const UserHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const toggleHelp = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const selectTopic = (topicId: string) => {
    setSelectedTopic(topicId === selectedTopic ? null : topicId);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button 
          onClick={toggleHelp} 
          className="rounded-full h-12 w-12 p-0 bg-brand-500 hover:bg-brand-600 shadow-lg"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className={`
          shadow-lg transition-all duration-300
          ${isMinimized 
            ? 'w-auto rounded-full' 
            : 'w-80 sm:w-96'}
        `}>
          {isMinimized ? (
            <Button 
              onClick={toggleHelp}
              variant="ghost"
              className="rounded-full flex items-center space-x-2 p-3"
            >
              <HelpCircle className="h-5 w-5 text-brand-500" />
              <span>Help & Resources</span>
              <Maximize2 
                className="h-4 w-4 ml-2" 
                onClick={toggleMinimize}
              />
            </Button>
          ) : (
            <>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle className="flex items-center">
                    <Book className="h-5 w-5 text-brand-500 mr-2" />
                    Help & Resources
                  </CardTitle>
                  <CardDescription>
                    Explore guides and tutorials
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={toggleMinimize}>
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={toggleHelp}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="max-h-[60vh] overflow-y-auto">
                {selectedTopic === null ? (
                  <div className="space-y-2">
                    {HELP_TOPICS.map((topic) => (
                      <Button
                        key={topic.id}
                        variant="outline"
                        className="w-full justify-between text-left h-auto py-3"
                        onClick={() => selectTopic(topic.id)}
                      >
                        <div>
                          <p className="font-medium">{topic.title}</p>
                          <p className="text-xs text-slate-500">{topic.description}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 flex-shrink-0 ml-2" />
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button
                      variant="ghost"
                      className="flex items-center mb-2 -ml-2 text-sm text-slate-600"
                      onClick={() => setSelectedTopic(null)}
                    >
                      <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                      Back to topics
                    </Button>
                    
                    {HELP_TOPICS.filter(t => t.id === selectedTopic).map((topic) => (
                      <div key={topic.id}>
                        <h3 className="text-lg font-medium mb-2">{topic.title}</h3>
                        <p className="text-slate-500 text-sm mb-4">{topic.description}</p>
                        
                        <div className="space-y-3">
                          {topic.steps.map((step, i) => (
                            <div key={i} className="flex items-start">
                              <div className="bg-brand-100 rounded-full h-6 w-6 flex items-center justify-center text-brand-700 text-xs font-medium flex-shrink-0 mt-0.5 mr-3">
                                {i + 1}
                              </div>
                              <p className="text-sm">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="bg-slate-50 py-3 px-4 border-t flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 text-xs flex items-center"
                >
                  <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                  Contact Support
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 text-xs"
                >
                  View Documentation
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  );
};
