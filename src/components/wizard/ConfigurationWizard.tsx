
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WizardStepIndicator } from './WizardStepIndicator';
import { WizardContent } from './WizardContent';
import { WizardFooter } from './WizardFooter';
import { ConfigurationWizardHeader } from './ConfigurationWizardHeader';
import { ConfigurationWizardContainer } from './ConfigurationWizardContainer';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { getStepTitle, getStepDescription } from './wizardSteps';

export const ConfigurationWizard = () => {
  const {
    currentStep,
    formData,
    updateFormData,
    visibleSteps,
    hasVisited,
    handleStepNavigation,
    handlePrevStep,
    handleComplete,
    isFirstStep,
    isLastStep
  } = ConfigurationWizardContainer();

  return (
    <ModernLayout contentWidth="default">
      <div className="w-full">
        <ConfigurationWizardHeader 
          title="Create New Project" 
          description="Configure your educational content project by following these steps."
        />
        
        <WizardStepIndicator 
          steps={visibleSteps}
          currentStep={currentStep}
          hasVisited={hasVisited}
          className="mb-8"
        />
        
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>{getStepTitle(currentStep)}</CardTitle>
            <CardDescription>{getStepDescription(currentStep)}</CardDescription>
          </CardHeader>
          
          <WizardContent 
            currentStep={currentStep}
            formData={formData}
            updateFormData={updateFormData}
          />
          
          <WizardFooter
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            onPrev={handlePrevStep}
            onNext={handleStepNavigation}
            onComplete={handleComplete}
          />
        </Card>
      </div>
    </ModernLayout>
  );
};

export default ConfigurationWizard;
