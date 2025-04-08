
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WizardStep {
  id: number;
  name: string;
  hidden?: boolean;
}

interface WizardContextType<T extends Record<string, any>> {
  currentStep: number;
  steps: WizardStep[];
  formData: T;
  updateFormData: (data: Partial<T>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepId: number) => void;
  hasVisited: (stepId: number) => boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface WizardProviderProps<T extends Record<string, any>> {
  children: React.ReactNode;
  steps: WizardStep[];
  initialData: T;
  saveKey?: string;
  navigateLogic?: (currentStep: number, formData: T, goToStep: (step: number) => void) => void;
}

const WizardContext = createContext<WizardContextType<any> | null>(null);

export function WizardProvider<T extends Record<string, any>>({
  children,
  steps,
  initialData,
  saveKey,
  navigateLogic
}: WizardProviderProps<T>) {
  // Load saved data from localStorage if available
  const loadSavedData = (): T => {
    if (!saveKey) return initialData;
    
    try {
      const saved = localStorage.getItem(`wizard-form-${saveKey}`);
      return saved ? JSON.parse(saved) : initialData;
    } catch (error) {
      console.error('Error loading saved form data:', error);
      return initialData;
    }
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<T>(loadSavedData);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (saveKey) {
      localStorage.setItem(`wizard-form-${saveKey}`, JSON.stringify(formData));
    }
  }, [formData, saveKey]);

  const updateFormData = (data: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
      setVisitedSteps(prev => {
        const updated = new Set(prev);
        updated.add(step);
        return updated;
      });
    }
  };

  const nextStep = () => {
    if (navigateLogic) {
      navigateLogic(currentStep, formData, goToStep);
    } else if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const hasVisited = (step: number): boolean => {
    if (typeof step !== 'number') {
      console.warn('Invalid step provided to hasVisited:', step);
      return false;
    }
    return visitedSteps.has(step);
  };

  const value = {
    currentStep,
    steps,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    hasVisited,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
  };

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard<T extends Record<string, any>>(): WizardContextType<T> {
  const context = useContext(WizardContext);
  
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  
  return context as WizardContextType<T>;
}
