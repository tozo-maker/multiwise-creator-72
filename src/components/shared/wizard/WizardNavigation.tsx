
import React from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { ThemeButton } from '@/components/shared/ThemeButton';
import { useTheme } from '@/contexts/ThemeContext';
import { Loader2, Save, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface WizardNavigationProps {
  onComplete: () => void;
  isSubmitting?: boolean;
  saveAsDraft?: boolean;
  onSaveDraft?: () => void;
  isSaving?: boolean;
  completeButtonText?: string;
  nextButtonText?: string;
  backButtonText?: string;
}

export function WizardNavigation({ 
  onComplete, 
  isSubmitting = false,
  saveAsDraft = false,
  onSaveDraft,
  isSaving = false,
  completeButtonText = "Create Project",
  nextButtonText = "Continue",
  backButtonText = "Back"
}: WizardNavigationProps) {
  const { isFirstStep, isLastStep, nextStep, prevStep, currentStep, steps, getVisibleSteps } = useWizard();
  const { isDark } = useTheme();
  
  const visibleSteps = getVisibleSteps();
  const currentStepIndex = visibleSteps.findIndex(step => step.id === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / visibleSteps.length) * 100;

  // Handle the next step with error handling
  const handleNextStep = () => {
    try {
      nextStep();
    } catch (error) {
      console.error('Error navigating to next step:', error);
    }
  };

  return (
    <div className={`p-6 border-t ${
      isDark ? 'border-slate-700' : 'border-slate-200'
    }`}>
      <div className="flex justify-between items-center">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {currentStepIndex + 1} of {visibleSteps.length} steps
        </div>
        <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
          {Math.round(progressPercentage)}% Complete
        </div>
      </div>
      
      <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full mt-2 mb-6">
        <div 
          className="h-1 bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between">
        <ThemeButton 
          variant="outline" 
          onClick={prevStep}
          disabled={isFirstStep || isSubmitting || isSaving}
          className="space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{backButtonText}</span>
        </ThemeButton>
        
        <div className="flex space-x-2">
          {saveAsDraft && onSaveDraft && (
            <ThemeButton
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSubmitting || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </>
              )}
            </ThemeButton>
          )}
          
          {!isLastStep ? (
            <ThemeButton 
              variant="primary"
              onClick={handleNextStep}
              disabled={isSubmitting || isSaving}
              className="space-x-2"
            >
              <span>{nextButtonText}</span>
              <ArrowRight className="h-4 w-4" />
            </ThemeButton>
          ) : (
            <ThemeButton 
              variant="primary"
              onClick={onComplete}
              disabled={isSubmitting || isSaving}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {completeButtonText}
                </>
              )}
            </ThemeButton>
          )}
        </div>
      </div>
    </div>
  );
}
