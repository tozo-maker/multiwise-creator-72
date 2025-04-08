
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from '@/components/ui/use-toast';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  spotlightRadius?: number;
  route?: string;
}

// Tour configuration
const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to MultiGuide!',
    description: 'This quick tour will help you get started with the platform. Click Next to continue.',
    route: '/dashboard',
  },
  {
    id: 'projects',
    title: 'Manage Your Projects',
    description: 'Here you can view all your educational content projects, filter them, and create new ones.',
    route: '/projects',
    target: '.project-list-container',
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    description: 'View detailed analytics about your projects and content performance.',
    route: '/analytics',
    target: '.analytics-container',
  },
  {
    id: 'new-project',
    title: 'Create New Projects',
    description: 'Quickly create new educational projects with our easy-to-use wizard.',
    route: '/projects',
    target: 'button:contains("New Project")',
  },
  {
    id: 'settings',
    title: 'Customize Your Experience',
    description: 'Configure your account and application settings from here.',
    route: '/settings',
  }
];

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tourActive, setTourActive] = useState(isOpen);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Reset the tour state when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setTourActive(true);
    } else {
      setTourActive(false);
    }
  }, [isOpen]);
  
  const currentTourStep = tourSteps[currentStep];
  
  // Navigate to the required route for the current step
  useEffect(() => {
    if (tourActive && currentTourStep?.route && location.pathname !== currentTourStep.route) {
      navigate(currentTourStep.route);
    }
  }, [currentStep, tourActive, navigate, location.pathname, currentTourStep]);
  
  const handleNextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      completeTour();
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };
  
  const completeTour = () => {
    setTourActive(false);
    onClose();
    
    // Show completion toast
    toast({
      title: 'Tour completed!',
      description: 'You can restart the tour anytime from the help menu.',
    });
    
    // Save tour completion to localStorage
    localStorage.setItem('guidedTourCompleted', 'true');
  };
  
  if (!tourActive) {
    return null;
  }
  
  return (
    <>
      <Dialog open={tourActive} onOpenChange={(open) => !open && completeTour()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentTourStep.title}</DialogTitle>
            <DialogDescription>
              {currentTourStep.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <div>
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={completeTour}>
                Skip
              </Button>
              <Button 
                onClick={handleNextStep}
              >
                {currentStep < tourSteps.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Highlight target element if specified */}
      {currentTourStep.target && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* We'd implement spotlight highlighting logic here */}
        </div>
      )}
    </>
  );
};

// Export a hook to easily use the guided tour
export const useGuidedTour = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  
  const startTour = () => setIsTourOpen(true);
  const endTour = () => setIsTourOpen(false);
  
  // Check if user has completed the tour before
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem('guidedTourCompleted') === 'true';
    
    // Auto-start tour for new users (after a short delay)
    if (!hasCompletedTour) {
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  return {
    isTourOpen,
    startTour,
    endTour,
    TourComponent: <GuidedTour isOpen={isTourOpen} onClose={endTour} />
  };
};
