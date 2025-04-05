
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ArrowRight } from 'lucide-react';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from '@/components/ui/drawer';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ProjectCreationWizard } from '@/components/project-creation/ProjectCreationWizard';
import { ProjectTemplate } from '@/components/project-creation/ProjectTemplate';
import { ProjectTemplateGallery } from '@/components/project-creation/ProjectTemplateGallery';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useToast } from '@/hooks/use-toast';

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

export const CreateProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Check if screen is mobile
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Handle selection of a template
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (isMobile) {
      setOpenDialog(true);
    } else {
      setOpen(true);
    }
  };
  
  // Get the selected template details
  const getSelectedTemplate = () => {
    return PROJECT_TEMPLATES.find(template => template.id === selectedTemplate);
  };
  
  // Handle project creation success
  const handleProjectCreated = (projectId: string) => {
    toast({
      title: "Project created successfully!",
      description: "Redirecting to your new project workspace...",
    });
    
    setTimeout(() => {
      navigate(`/projects/${projectId}`);
    }, 1500);
  };

  return (
    <MainLayout contentWidth="wide">
      <div className="space-y-6 pb-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
            <p className="text-muted-foreground mt-2">
              Choose a starting point for your new educational content project
            </p>
          </div>
        </div>
        
        <Alert variant="default" className="bg-brand-50 border-brand-200">
          <Info className="h-4 w-4 text-brand-500" />
          <AlertDescription>
            All project templates are fully customizable. You can always change settings later.
          </AlertDescription>
        </Alert>
        
        <ProjectTemplateGallery 
          templates={PROJECT_TEMPLATES} 
          onSelect={handleTemplateSelect}
          selectedTemplate={selectedTemplate ?? undefined}
        />
        
        {/* Create project wizard - Desktop drawer */}
        <Drawer open={open && !isMobile} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-2xl">Create {getSelectedTemplate()?.name}</DrawerTitle>
              <DrawerDescription>
                Complete these steps to set up your new project
              </DrawerDescription>
            </DrawerHeader>
            
            <div className="px-4">
              <ProjectCreationWizard 
                templateId={selectedTemplate || 'blank'}
                onComplete={handleProjectCreated}
              />
            </div>
            
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        
        {/* Create project wizard - Mobile dialog */}
        <Dialog open={openDialog && isMobile} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-full sm:max-w-[425px] h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Create {getSelectedTemplate()?.name}</DialogTitle>
              <DialogDescription>
                Complete these steps to set up your new project
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto">
              <ProjectCreationWizard 
                templateId={selectedTemplate || 'blank'}
                onComplete={handleProjectCreated}
                isMobile={true}
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};
