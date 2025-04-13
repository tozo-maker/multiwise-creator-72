import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectOutline, OutlineSection, OutlineItem } from '@/types/outline';
import { OutlineService } from '@/services/OutlineService';
import { toast } from '@/hooks/use-toast';
import { PlusCircle, Save, FileDown, FileUp, Sparkles, FileBarChart2 } from 'lucide-react';
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
}

export const OutlineEditor: React.FC<OutlineEditorProps> = ({ 
  outline, 
  projectId,
  onSave,
  onGenerateOutline
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [workingOutline, setWorkingOutline] = useState<ProjectOutline | null>(outline);
  const [isCreatingOutline, setIsCreatingOutline] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showExport, setShowExport] = useState(false);
  
  useEffect(() => {
    setWorkingOutline(outline);
  }, [outline]);
  
  const createNewOutline = async () => {
    setIsCreatingOutline(true);
    try {
      const newOutline = await OutlineService.createOutline(
        projectId,
        'Project Outline',
        'Main outline for the project'
      );
      
      if (newOutline) {
        setWorkingOutline({
          ...newOutline,
          sections: []
        });
        toast({
          title: 'New outline created',
          description: 'Start adding sections and items to build your outline'
        });
      }
    } catch (error) {
      console.error('Error creating outline:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new outline',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingOutline(false);
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
    
    // If it's a new section (not saved to DB yet), just remove it from state
    if (sectionId.startsWith('new-')) {
      const updatedSections = workingOutline.sections.filter(section => section.id !== sectionId);
      setWorkingOutline({
        ...workingOutline,
        sections: updatedSections
      });
      return;
    }
    
    // Otherwise, delete from DB
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
    }
  };
  
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!workingOutline) return;
    
    const sectionIndex = workingOutline.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;
    
    const newSections = [...workingOutline.sections];
    
    if (direction === 'up' && sectionIndex > 0) {
      // Swap with previous section
      const temp = newSections[sectionIndex];
      newSections[sectionIndex] = newSections[sectionIndex - 1];
      newSections[sectionIndex - 1] = temp;
      
      // Update order values
      newSections[sectionIndex].order = sectionIndex;
      newSections[sectionIndex - 1].order = sectionIndex - 1;
    } else if (direction === 'down' && sectionIndex < newSections.length - 1) {
      // Swap with next section
      const temp = newSections[sectionIndex];
      newSections[sectionIndex] = newSections[sectionIndex + 1];
      newSections[sectionIndex + 1] = temp;
      
      // Update order values
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
    
    try {
      await onSave(workingOutline);
    } catch (error) {
      console.error('Error saving outline:', error);
    }
  };

  if (!workingOutline) {
    return (
      <EmptyOutline 
        onCreateOutline={createNewOutline} 
        onGenerateAIOutline={onGenerateOutline}
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
            onClick={onGenerateOutline}
          >
            <Sparkles size={16} />
            <span className="hidden sm:inline">Generate with AI</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1"
            onClick={handleSaveOutline}
          >
            <Save size={16} />
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
