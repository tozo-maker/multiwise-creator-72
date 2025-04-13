
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WizardStep {
  id: number;
  name: string;
  hidden?: boolean;
  conditional?: (data: any) => boolean;
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
  getVisibleSteps: () => WizardStep[];
  isStepVisible: (stepId: number) => boolean;
  isStepAvailable: (stepId: number) => boolean;
  resetForm: () => void;
  stepProgress: number;
}

interface WizardProviderProps<T extends Record<string, any>> {
  children: (context: WizardContextType<T>) => React.ReactNode;
  steps: WizardStep[];
  initialData: T;
  saveKey?: string;
  navigateLogic?: (currentStep: number, formData: T, goToStep: (step: number) => void) => boolean | void | React.ReactNode;
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
  
  const isStepVisible = (stepId: number): boolean => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return false;
    
    if (step.hidden) return false;
    if (step.conditional && !step.conditional(formData)) return false;
    
    return true;
  };
  
  const isStepAvailable = (stepId: number): boolean => {
    return isStepVisible(stepId) && hasVisited(stepId);
  };
  
  const getVisibleSteps = (): WizardStep[] => {
    return steps.filter(step => isStepVisible(step.id));
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length && isStepVisible(step)) {
      setCurrentStep(step);
      setVisitedSteps(prev => {
        const updated = new Set(prev);
        updated.add(step);
        return updated;
      });
    }
  };

  const findNextVisibleStep = (startStep: number): number => {
    let nextStep = startStep + 1;
    while (nextStep < steps.length) {
      if (isStepVisible(nextStep)) {
        return nextStep;
      }
      nextStep++;
    }
    return -1; // No visible step found
  };
  
  const findPrevVisibleStep = (startStep: number): number => {
    let prevStep = startStep - 1;
    while (prevStep >= 0) {
      if (isStepVisible(prevStep)) {
        return prevStep;
      }
      prevStep--;
    }
    return -1; // No visible step found
  };

  const nextStep = () => {
    if (navigateLogic) {
      const result = navigateLogic(currentStep, formData, goToStep);
      
      // If navigateLogic returns false, stop navigation
      if (result === false) {
        return;
      }
    }
    
    const nextVisibleStep = findNextVisibleStep(currentStep);
    if (nextVisibleStep !== -1) {
      goToStep(nextVisibleStep);
    }
  };

  const prevStep = () => {
    const prevVisibleStep = findPrevVisibleStep(currentStep);
    if (prevVisibleStep !== -1) {
      goToStep(prevVisibleStep);
    }
  };

  const hasVisited = (step: number): boolean => {
    if (typeof step !== 'number') {
      console.warn('Invalid step provided to hasVisited:', step);
      return false;
    }
    return visitedSteps.has(step);
  };
  
  const resetForm = () => {
    setFormData(initialData);
    setCurrentStep(0);
    setVisitedSteps(new Set([0]));
  };
  
  // Calculate visible step progress percentage
  const calculateStepProgress = (): number => {
    const visibleSteps = getVisibleSteps();
    const currentStepIndex = visibleSteps.findIndex(step => step.id === currentStep);
    if (currentStepIndex === -1) return 0;
    return ((currentStepIndex + 1) / visibleSteps.length) * 100;
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
    isLastStep: currentStep === steps.length - 1 || findNextVisibleStep(currentStep) === -1,
    getVisibleSteps,
    isStepVisible,
    isStepAvailable,
    resetForm,
    stepProgress: calculateStepProgress()
  };

  return (
    <WizardContext.Provider value={value}>
      {children(value)}
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
