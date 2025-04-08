
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiChatInterface } from '@/components/content/AiChatInterface';
import { useIsMobile } from '@/hooks/use-mobile';

// Import our new component files
import { ContentFormHeader } from './content-form/ContentFormHeader';
import { ContextFilesSection } from './content-form/ContextFilesSection';
import { KnowledgeBaseDialog } from './content-form/KnowledgeBaseDialog';
import { ContentTypeSettings } from './content-form/ContentTypeSettings';
import { ContentFormActions } from './content-form/ContentFormActions';
import { ContentPreview } from './content-form/ContentPreview';

interface ContextFile {
  id: string;
  name: string;
  instructions: string;
}

export const ContentCreationForm = () => {
  const [title, setTitle] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [selectKBDialogOpen, setSelectKBDialogOpen] = useState(false);
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [generatedContent, setGeneratedContent] = useState('');
  const [contentType, setContentType] = useState('lesson');
  const [targetLevel, setTargetLevel] = useState('intermediate');
  const isMobile = useIsMobile();
  
  // Mock KB files for the dialog
  const knowledgeBaseFiles = [
    { id: '1', name: 'Curriculum Standards.pdf', description: 'National curriculum standards' },
    { id: '2', name: 'Style Guide.docx', description: 'Official writing style guidelines' },
    { id: '3', name: 'Example Chapter.docx', description: 'Example chapter with formatting' },
    { id: '4', name: 'Terminology.txt', description: 'Approved terminology list' },
    { id: '5', name: 'Cultural References.pdf', description: 'Cultural context document' },
  ];
  
  const [selectedKBFiles, setSelectedKBFiles] = useState<string[]>([]);
  
  const handleAddToContext = () => {
    const newContextFiles = knowledgeBaseFiles
      .filter(file => selectedKBFiles.includes(file.id))
      .map(file => ({
        id: file.id,
        name: file.name,
        instructions: ''
      }));
    
    setContextFiles([...contextFiles, ...newContextFiles]);
    setSelectedKBFiles([]);
    setSelectKBDialogOpen(false);
  };
  
  const handleGenerate = () => {
    setIsGenerating(true);
    setActiveTab('ai');
    
    // Prepare initial prompt based on form inputs
    const filesContext = contextFiles.length > 0 
      ? `Use these reference files as context: ${contextFiles.map(f => f.name).join(', ')}. `
      : '';
    
    const initialPrompt = `Create educational content for a section titled "${title}". ${filesContext}The content should be structured with clear learning objectives, explanations, examples, and practice activities.`;
    
    // In a real implementation, you would handle the API call here
    setTimeout(() => {
      setIsGenerating(false);
      // Here you would handle the response and display the generated content
    }, 500);
  };
  
  const handleContentGenerated = (content: string) => {
    setGeneratedContent(content);
  };
  
  return (
    <div>
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="form" className="flex-1">Configuration</TabsTrigger>
          <TabsTrigger value="ai" className="flex-1">AI Assistant</TabsTrigger>
          {!isMobile && (
            <TabsTrigger value="preview" className="flex-1">Content Preview</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="form" className="space-y-6">
          <ContentFormHeader 
            title={title}
            setTitle={setTitle}
            identifier={identifier}
            setIdentifier={setIdentifier}
          />
          
          <ContextFilesSection 
            contextFiles={contextFiles}
            setContextFiles={setContextFiles}
            openKnowledgeBaseDialog={() => setSelectKBDialogOpen(true)}
          />
          
          <ContentTypeSettings 
            contentType={contentType}
            setContentType={setContentType}
            targetLevel={targetLevel}
            setTargetLevel={setTargetLevel}
          />
          
          <ContentFormActions 
            isGenerating={isGenerating}
            disabled={!title}
            onGenerate={handleGenerate}
          />
        </TabsContent>
        
        <TabsContent value="ai">
          <div className="h-[600px]">
            <AiChatInterface 
              contextFiles={contextFiles.map(file => ({ name: file.name }))}
              initialPrompt={
                title ? `Create educational content for a section titled "${title}". The content should be structured with clear learning objectives, explanations, examples, and practice activities.` : ''
              }
              onContentGenerated={handleContentGenerated}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          <ContentPreview 
            title={title}
            generatedContent={generatedContent}
          />
        </TabsContent>
      </Tabs>
      
      <KnowledgeBaseDialog 
        isOpen={selectKBDialogOpen}
        onOpenChange={setSelectKBDialogOpen}
        knowledgeBaseFiles={knowledgeBaseFiles}
        selectedFiles={selectedKBFiles}
        setSelectedFiles={setSelectedKBFiles}
        addFilesToContext={handleAddToContext}
      />
    </div>
  );
};
