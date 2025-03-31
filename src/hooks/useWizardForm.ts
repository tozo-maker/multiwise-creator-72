
import { useState, useEffect } from 'react';

export interface WizardFormOptions<T> {
  initialData: T;
  steps: number;
  saveKey?: string;
}

export function useWizardForm<T extends Record<string, any>>({ 
  initialData, 
  steps, 
  saveKey 
}: WizardFormOptions<T>) {
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
    if (step >= 0 && step < steps) {
      setCurrentStep(step);
      setVisitedSteps(prev => {
        const updated = new Set(prev);
        updated.add(step);
        return updated;
      });
    }
  };

  const nextStep = () => {
    if (currentStep < steps - 1) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const hasVisited = (step: number) => visitedSteps.has(step);

  return {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    hasVisited,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps - 1,
  };
}
