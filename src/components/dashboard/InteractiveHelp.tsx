
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, MessageSquare, Lightbulb, HelpCircle, X } from 'lucide-react';

interface InteractiveHelpProps {
  isNew?: boolean;
  className?: string;
}

export const InteractiveHelp = ({ isNew = false, className }: InteractiveHelpProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  
  const steps = [
    {
      title: "Welcome to MultiGuide",
      description: "Let's get you started with the basics of creating educational content.",
      icon: <MessageSquare className="h-5 w-5 text-brand-600" />
    },
    {
      title: "Create your first project",
      description: "Start by setting up a new project with your educational goals and target language.",
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />
    },
    {
      title: "Build your knowledge base",
      description: "Upload reference materials to help the AI understand your content needs.",
      icon: <HelpCircle className="h-5 w-5 text-blue-500" />
    }
  ];
  
  if (dismissed) {
    return null;
  }
  
  return (
    <Card className={`border-brand-200 ${className}`}>
      <div className="absolute top-3 right-3">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6" 
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4 text-slate-400" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
      
      <CardContent className="pt-6 pb-4">
        <div className="flex items-start space-x-4">
          <div className="bg-brand-100 rounded-full p-2 mt-1">
            {steps[currentStep].icon}
          </div>
          <div>
            <h3 className="font-medium text-slate-900">
              {steps[currentStep].title}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {steps[currentStep].description}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4 flex justify-between">
        <div className="flex space-x-1">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 rounded-full w-6 ${
                index === currentStep ? 'bg-brand-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-600"
            onClick={() => setDismissed(true)}
          >
            Skip
          </Button>
          
          <Button 
            size="sm" 
            className="gap-1"
            onClick={() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
              } else {
                setDismissed(true);
              }
            }}
          >
            {currentStep < steps.length - 1 ? 'Next' : 'Got it'}
            {currentStep < steps.length - 1 && (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
