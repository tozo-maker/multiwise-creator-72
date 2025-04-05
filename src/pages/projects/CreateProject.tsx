
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ProjectTemplateGallery } from '@/components/project-creation/ProjectTemplateGallery';
import { useToast } from '@/hooks/use-toast';
import { useWizardForm } from '@/hooks/useWizardForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define the available templates
const PROJECT_TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank Project',
    description: 'Start from scratch with a clean project',
    icon: 'file-text',
    features: ['Clean slate', 'Full customization', 'No presets']
  },
  {
    id: 'curriculum',
    name: 'Educational Curriculum',
    description: 'Create a comprehensive educational curriculum with lessons and assessments',
    icon: 'book-open',
    features: ['Structured lessons', 'Assessment tools', 'Student progress tracking']
  },
  {
    id: 'language',
    name: 'Language Learning',
    description: 'Build a language learning program with vocabulary, grammar, and exercises',
    icon: 'languages',
    features: ['Vocabulary management', 'Interactive exercises', 'Progress tracking']
  },
  {
    id: 'assessment',
    name: 'Assessment Tools',
    description: 'Create quizzes, tests, and other assessment materials',
    icon: 'clipboard-check',
    features: ['Various question types', 'Automated grading', 'Result analytics']
  }
];

// Define form data interface
interface ProjectFormData {
  templateId: string;
  name: string;
  description: string;
  projectType: string;
  customProjectType: string;
  targetAudiences: string[];
  language: string;
  complexity: string;
  knowledgeBase: {
    includeDocuments: boolean;
    documents: { name: string; size: number; type: string }[];
  };
}

// Define step interface
interface WizardStep {
  id: number;
  name: string;
}

export const CreateProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Define wizard steps
  const WIZARD_STEPS: WizardStep[] = [
    { id: 0, name: 'Template Selection' },
    { id: 1, name: 'Project Basics' },
    { id: 2, name: 'Configuration' },
    { id: 3, name: 'Knowledge Base' },
    { id: 4, name: 'Review & Create' }
  ];
  
  // Use the wizard form hook
  const {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    hasVisited
  } = useWizardForm<ProjectFormData>({
    initialData: {
      templateId: '',
      name: '',
      description: '',
      projectType: 'Standard',
      customProjectType: '',
      targetAudiences: [],
      language: 'English',
      complexity: 'Intermediate',
      knowledgeBase: {
        includeDocuments: false,
        documents: []
      }
    },
    steps: WIZARD_STEPS.length,
    saveKey: 'new-project-creation'
  });

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    updateFormData({ templateId });
  };
  
  // Handle project creation success
  const handleProjectCreated = () => {
    toast({
      title: "Project created successfully!",
      description: "Redirecting to your new project workspace...",
    });
    
    // Generate a random project ID for demo purposes
    const projectId = 'proj_' + Math.random().toString(36).substr(2, 9);
    
    setTimeout(() => {
      navigate(`/projects/${projectId}`);
    }, 1500);
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / WIZARD_STEPS.length) * 100;
  
  // Validate current step and proceed to next
  const validateAndProceed = () => {
    // Validation for each step
    if (currentStep === 0 && !formData.templateId) {
      toast({
        title: "Template selection required",
        description: "Please select a template to continue.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 1 && !formData.name) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project.",
        variant: "destructive"
      });
      return;
    }
    
    nextStep();
  };
  
  // Handle form submission
  const handleSubmit = () => {
    toast({
      title: "Creating project...",
      description: "Setting up your new project environment."
    });
    
    setTimeout(() => {
      handleProjectCreated();
    }, 2000);
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <Alert variant="default" className="bg-brand-50 border-brand-200">
              <Info className="h-4 w-4 text-brand-500" />
              <AlertDescription>
                All project templates are fully customizable. You can always change settings later.
              </AlertDescription>
            </Alert>
            
            <ProjectTemplateGallery 
              templates={PROJECT_TEMPLATES} 
              onSelect={handleTemplateSelect}
              selectedTemplate={formData.templateId}
            />
          </div>
        );
        
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Project Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500"
                  placeholder="My New Project"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Choose a descriptive name for your project
                </p>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500"
                  placeholder="Brief description of your project"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">
                  Project Type
                </label>
                <select
                  id="projectType"
                  value={formData.projectType}
                  onChange={(e) => updateFormData({ projectType: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Curriculum">Curriculum</option>
                  <option value="Assessment">Assessment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {formData.projectType === 'Other' && (
                <div>
                  <label htmlFor="customProjectType" className="block text-sm font-medium text-gray-700">
                    Custom Project Type
                  </label>
                  <input
                    id="customProjectType"
                    type="text"
                    value={formData.customProjectType}
                    onChange={(e) => updateFormData({ customProjectType: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500"
                    placeholder="Specify your project type"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Primary Language
                </label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => updateFormData({ language: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Audience
                </label>
                <div className="mt-2 space-y-2">
                  {['K-12', 'Higher Education', 'Professional', 'Adult Learners', 'Special Education'].map((audience) => (
                    <label key={audience} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.targetAudiences.includes(audience)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          updateFormData({
                            targetAudiences: isChecked
                              ? [...formData.targetAudiences, audience]
                              : formData.targetAudiences.filter(a => a !== audience)
                          });
                        }}
                        className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                      />
                      <span className="ml-2 text-sm">{audience}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="customAudience" className="block text-sm font-medium text-gray-700">
                  Custom Audience
                </label>
                <div className="mt-1 flex">
                  <input
                    id="customAudience"
                    type="text"
                    className="block w-full rounded-l-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500"
                    placeholder="Add custom audience"
                  />
                  <Button 
                    type="button" 
                    className="rounded-l-none bg-brand-500 hover:bg-brand-600"
                    onClick={() => {
                      const customAudience = (document.getElementById('customAudience') as HTMLInputElement).value;
                      if (customAudience && !formData.targetAudiences.includes(customAudience)) {
                        updateFormData({
                          targetAudiences: [...formData.targetAudiences, customAudience]
                        });
                        (document.getElementById('customAudience') as HTMLInputElement).value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="complexity" className="block text-sm font-medium text-gray-700">
                  Content Complexity
                </label>
                <select
                  id="complexity"
                  value={formData.complexity}
                  onChange={(e) => updateFormData({ complexity: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Mixed">Mixed</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  This helps tailor content to the appropriate skill level
                </p>
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium text-gray-700">Selected Target Audiences:</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.targetAudiences.length > 0 ? (
                    formData.targetAudiences.map((audience) => (
                      <div 
                        key={audience} 
                        className="flex items-center bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm"
                      >
                        {audience}
                        <button
                          type="button"
                          className="ml-2 text-brand-500 hover:text-brand-700"
                          onClick={() => updateFormData({
                            targetAudiences: formData.targetAudiences.filter(a => a !== audience)
                          })}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No target audiences selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Knowledge Base</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add documents to your project's knowledge base to provide reference materials
              </p>
              
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.knowledgeBase.includeDocuments}
                    onChange={(e) => updateFormData({ 
                      knowledgeBase: { 
                        ...formData.knowledgeBase, 
                        includeDocuments: e.target.checked 
                      } 
                    })}
                    className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <span className="ml-2 text-sm font-medium">Include documents in knowledge base</span>
                </label>
              </div>
              
              {formData.knowledgeBase.includeDocuments && (
                <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Drag and drop files here, or click to select files
                      </p>
                    </div>
                    <div className="mt-2">
                      <Button
                        type="button"
                        className="bg-brand-500 hover:bg-brand-600"
                      >
                        Upload Files
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      PDF, DOCX, TXT, up to 10MB each
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Project Summary</h3>
              
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-semibold">Template</h4>
                    <p className="text-sm">
                      {PROJECT_TEMPLATES.find(t => t.id === formData.templateId)?.name || 'None selected'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-semibold">Project Name</h4>
                    <p className="text-sm">{formData.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-semibold">Project Type</h4>
                    <p className="text-sm">
                      {formData.projectType === 'Other' ? formData.customProjectType : formData.projectType}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-semibold">Language</h4>
                    <p className="text-sm">{formData.language}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-semibold">Complexity</h4>
                    <p className="text-sm">{formData.complexity}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-semibold">Target Audience</h4>
                    <p className="text-sm">
                      {formData.targetAudiences.length > 0 
                        ? formData.targetAudiences.join(', ')
                        : 'None specified'}
                    </p>
                  </div>
                </div>
                
                {formData.description && (
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-semibold">Description</h4>
                    <p className="text-sm">{formData.description}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-xs uppercase text-gray-500 font-semibold">Knowledge Base</h4>
                  <p className="text-sm">
                    {formData.knowledgeBase.includeDocuments 
                      ? `${formData.knowledgeBase.documents.length} documents included`
                      : 'No documents included'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <MainLayout contentWidth="wide">
      <div className="space-y-6 pb-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
            <p className="text-muted-foreground mt-2">
              Set up your educational content project in a few steps
            </p>
          </div>
        </div>
        
        {/* Wizard progress bar and step indicator */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Step {currentStep + 1} of {WIZARD_STEPS.length}</span>
              <span>{WIZARD_STEPS[currentStep].name}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="mt-4 flex justify-between">
            {WIZARD_STEPS.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 ${
                    currentStep === index
                      ? 'border-brand-500 text-brand-500'
                      : hasVisited(index)
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}
                >
                  {hasVisited(index) && currentStep !== index ? '✓' : index + 1}
                </div>
                <div className="mt-1 text-xs max-w-[80px] truncate">
                  {step.name}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Step content */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          {renderStepContent()}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          {isLastStep ? (
            <Button 
              onClick={handleSubmit}
              className="bg-brand-500 hover:bg-brand-600 text-white"
            >
              Create Project
            </Button>
          ) : (
            <Button 
              onClick={validateAndProceed}
              className="bg-brand-500 hover:bg-brand-600 text-white"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
