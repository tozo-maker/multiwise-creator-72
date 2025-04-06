
import { WizardStep } from './WizardStepIndicator';

export const WIZARD_STEPS: WizardStep[] = [
  { id: 0, name: 'Project Info' },
  { id: 1, name: 'Quick Start' },
  { id: 2, name: 'System Config' },
  { id: 3, name: 'Project Config' },
  { id: 4, name: 'Language Config' },
  { id: 5, name: 'Documents' },
  { id: 6, name: 'Summary' }
];

export const getStepTitle = (currentStep: number): string => {
  switch (currentStep) {
    case 0: return "Project Name";
    case 1: return "Choose Your Path";
    case 2: return "System Configuration";
    case 3: return "Project Configuration";
    case 4: return "Language & Content Configuration";
    case 5: return "Add Reference Materials";
    case 6: return "Review & Create";
    default: return "";
  }
};

export const getStepDescription = (currentStep: number): string => {
  switch (currentStep) {
    case 0: return "Name your project and get started.";
    case 1: return "Choose a template or start with custom configuration.";
    case 2: return "Configure how you want to interact with the system.";
    case 3: return "Define the core parameters of your educational project.";
    case 4: return "Set language preferences and content parameters.";
    case 5: return "Upload documents needed for your configuration.";
    case 6: return "Review your configuration and create your project.";
    default: return "";
  }
};
