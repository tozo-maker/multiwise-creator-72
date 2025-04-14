import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectOutline, OutlineSection, OutlineItem } from '@/types/outline';
import { OutlineService } from '@/services/OutlineService';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Save, FileDown, FileUp, Sparkles, FileBarChart2, Loader2 } from 'lucide-react';
import { OutlineSection as OutlineSectionComponent } from './OutlineSection';
import { EmptyOutline } from './EmptyOutline';
import { OutlineExport } from './OutlineExport';
import { useTheme } from '@/contexts/ThemeContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OutlineVersionHistory } from './OutlineVersionHistory';

interface OutlineEditorProps {
  outline: ProjectOutline | null;
  projectId: string;
  onSave: (outline: ProjectOutline) => Promise<void>;
  onGenerateOutline: () => Promise<void>;
  onCreateOutline: () => Promise<void>;
}

export const OutlineEditor: React.FC<OutlineEditorProps> = ({ 
  outline, 
  projectId,
  onSave,
  onGenerateOutline,
  onCreateOutline
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { toast } = useToast();
  
  const [workingOutline, setWorkingOutline] = useState<ProjectOutline | null>(outline);
  const [isCreatingOutline, setIsCreatingOutline] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    setWorkingOutline(outline);
  }, [outline]);
  
  const createNewOutline = async () => {
    try {
      setIsCreatingOutline(true);
      console.log('Creating new outline for project:', projectId);
      
      await onCreateOutline();
      
      toast({
        title: 'New outline created',
        description: 'Start adding sections and items to build your outline'
      });
    } catch (error: any) {
      console.error('Error creating outline:', error);
      toast({
        title: 'Error creating outline',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingOutline(false);
    }
  };
  
  const handleGenerateWithAI = async () => {
    try {
      await onGenerateOutline();
    } catch (error: any) {
      console.error('Error generating outline with AI:', error);
      toast({
        title: 'Error generating outline',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };
  
  const handleAddSection = () => {
    if (!workingOutline) return;
    
    const newSection: OutlineSection = {
      id: `new-${Date.now()}`,
      title: 'New Section',
      description: '',
      projectId,
      order: workingOutline.sections.length,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setWorkingOutline({
      ...workingOutline,
      sections: [...workingOutline.sections, newSection]
    });
  };
  
  const handleUpdateSection = (updatedSection: OutlineSection) => {
    if (!workingOutline) return;
    
    const updatedSections = workingOutline.sections.map(section => 
      section.id === updatedSection.id ? updatedSection : section
    );
    
    setWorkingOutline({
      ...workingOutline,
      sections: updatedSections
    });
  };
  
  const handleDeleteSection = async (sectionId: string) => {
    if (!workingOutline) return;
    
    if (sectionId.startsWith('new-')) {
      const updatedSections = workingOutline.sections.filter(section => section.id !== sectionId);
      setWorkingOutline({
        ...workingOutline,
        sections: updatedSections
      });
      return;
    }
    
    try {
      const success = await OutlineService.deleteSection(sectionId);
      if (success) {
        const updatedSections = workingOutline.sections.filter(section => section.id !== sectionId);
        setWorkingOutline({
          ...workingOutline,
          sections: updatedSections
        });
        toast({
          title: 'Section deleted',
          description: 'Section and its items have been removed'
        });
      } else {
        throw new Error('Failed to delete section');
      }
    } catch (error: any) {
      console.error('Error deleting section:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete section',
        variant: 'destructive'
      });
    }
  };
  
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!workingOutline) return;
    
    const sectionIndex = workingOutline.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;
    
    const newSections = [...workingOutline.sections];
    
    if (direction === 'up' && sectionIndex > 0) {
      const temp = newSections[sectionIndex];
      newSections[sectionIndex] = newSections[sectionIndex - 1];
      newSections[sectionIndex - 1] = temp;
      
      newSections[sectionIndex].order = sectionIndex;
      newSections[sectionIndex - 1].order = sectionIndex - 1;
    } else if (direction === 'down' && sectionIndex < newSections.length - 1) {
      const temp = newSections[sectionIndex];
      newSections[sectionIndex] = newSections[sectionIndex + 1];
      newSections[sectionIndex + 1] = temp;
      
      newSections[sectionIndex].order = sectionIndex;
      newSections[sectionIndex + 1].order = sectionIndex + 1;
    }
    
    setWorkingOutline({
      ...workingOutline,
      sections: newSections
    });
  };
  
  const handleSaveOutline = async () => {
    if (!workingOutline) return;
    
    setIsSaving(true);
    try {
      await onSave(workingOutline);
      toast({
        title: 'Success',
        description: 'Outline saved successfully',
      });
    } catch (error: any) {
      console.error('Error saving outline:', error);
      toast({
        title: 'Error saving outline',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!workingOutline) {
    return (
      <EmptyOutline 
        onCreateOutline={createNewOutline} 
        onGenerateAIOutline={handleGenerateWithAI}
        isCreating={isCreatingOutline}
      />
    );
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {workingOutline.title}
          </h3>
          {workingOutline.description && (
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {workingOutline.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <FileBarChart2 size={16} />
                <span className="hidden sm:inline">Versions</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Outline Version History</DialogTitle>
                <DialogDescription>
                  View and restore previous versions of your outline
                </DialogDescription>
              </DialogHeader>
              {workingOutline && workingOutline.id && (
                <OutlineVersionHistory outlineId={workingOutline.id} />
              )}
            </DialogContent>
          </Dialog>
          
          <Dialog open={showExport} onOpenChange={setShowExport}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <FileDown size={16} />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Outline</DialogTitle>
                <DialogDescription>
                  Export your outline in different formats
                </DialogDescription>
              </DialogHeader>
              <OutlineExport outline={workingOutline} />
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={handleGenerateWithAI}
          >
            <Sparkles size={16} />
            <span className="hidden sm:inline">Generate with AI</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1"
            onClick={handleSaveOutline}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
            <span>Save</span>
          </Button>
        </div>
      </div>
      
      <Card className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}>
        <CardContent className="p-6">
          <div className="space-y-6">
            {workingOutline.sections.map((section, index) => (
              <OutlineSectionComponent
                key={section.id}
                section={section}
                projectId={projectId}
                onUpdate={handleUpdateSection}
                onDelete={() => handleDeleteSection(section.id)}
                onMoveUp={() => handleMoveSection(section.id, 'up')}
                onMoveDown={() => handleMoveSection(section.id, 'down')}
                canMoveUp={index > 0}
                canMoveDown={index < workingOutline.sections.length - 1}
              />
            ))}
            
            <Button
              variant="outline"
              onClick={handleAddSection}
              className="w-full border-dashed gap-2"
            >
              <PlusCircle size={16} />
              Add New Section
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
