
import { WizardStep } from './WizardStepIndicator';

export const WIZARD_STEPS: WizardStep[] = [
  { id: 0, name: 'Project Info' },
  { id: 1, name: 'System Config' },
  { id: 2, name: 'Project Config' },
  { id: 3, name: 'Language Config' },
  { id: 4, name: 'Documents' },
  { id: 5, name: 'Summary' }
];

export const getStepTitle = (currentStep: number): string => {
  switch (currentStep) {
    case 0: return "Project Information";
    case 1: return "System Configuration";
    case 2: return "Project Configuration";
    case 3: return "Language & Content Configuration";
    case 4: return "Upload Project Documents";
    case 5: return "Review & Create";
    default: return "";
  }
};

export const getStepDescription = (currentStep: number): string => {
  switch (currentStep) {
    case 0: return "Name your project and choose a starting point.";
    case 1: return "Configure how you want to interact with the system.";
    case 2: return "Define the educational project specifications.";
    case 3: return "Set language preferences and content parameters.";
    case 4: return "Upload documents needed for your custom configuration.";
    case 5: return "Review your configuration and create your project.";
    default: return "";
  }
};
