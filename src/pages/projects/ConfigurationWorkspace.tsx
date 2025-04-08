
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useToast } from '@/hooks/use-toast';
import { ConfigData } from '@/components/wizard/types';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';

export const ConfigurationWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  
  // Mock project data - would normally be fetched based on ID
  const project = {
    id: projectId || '1',
    name: 'Spanish Language Textbook',
    type: 'Textbook',
    targetLanguage: 'Spanish',
    lastModified: '2 hours ago',
    progress: 65
  };
  
  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: project.name, path: `/projects/${projectId}` },
    { label: 'Configuration' }
  ];
  
  // Mock configuration data that would be retrieved from the backend
  const [configData, setConfigData] = useState<ConfigData>({
    // Project Info
    name: 'Spanish Language Textbook',
    quickStart: 'custom',
    
    // System Config
    interfaceLanguage: 'English',
    experienceLevel: 'Intermediate',
    interactionMode: 'Guided',
    outputDetail: 'Detailed',
    systemBehavior: 'Balanced',
    
    // Project Config
    projectType: 'Textbook',
    customProjectType: '',
    subjects: ['Spanish', 'Language Arts'],
    levels: ['Secondary', 'High School'],
    pedagogy: 'Standard',
    customPedagogy: '',
    wordCount: 5000,
    wordDistribution: 'balanced',
    wordEnforcement: 'flexible',
    
    // Language Config
    targetLanguage: 'Spanish',
    goal: 'Teaching',
    complexity: 'Intermediate',
    culturalIntegration: 'Moderate',
    terminology: 'Standard',
    markers: 'Standard',
    standards: [],
    customStandards: [],
    structure: 'Default',
    formatting: 'Default',
    scriptType: 'Latin',
    
    // Documents
    uploadedDocuments: [],
    needsDocumentUpload: false,
    
    // Metadata
    createdDate: new Date().toISOString(),
    lastModified: new Date().toISOString()
  });

  const updateConfigData = (data: Partial<ConfigData>) => {
    setConfigData({ ...configData, ...data });
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Changes saved",
      description: "Project configuration has been updated successfully."
    });
  };

  return (
    <ModernLayout contentWidth="wide">
      <div className="space-y-6">
        <div className="pt-4">
          <PageBreadcrumbs items={breadcrumbItems} />
        </div>
      
        <ProjectWorkspaceHeader 
          projectName={project.name}
          projectType={project.type}
          targetLanguage={project.targetLanguage}
        />
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="configuration" />
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-slate-100">Project Configuration</CardTitle>
            <CardDescription className="text-slate-400">
              Edit your project settings and parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="system" className="space-y-6">
              <TabsList className="bg-slate-700 p-1 w-fit">
                <TabsTrigger value="system" className="data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white px-4">System</TabsTrigger>
                <TabsTrigger value="project" className="data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white px-4">Project</TabsTrigger>
                <TabsTrigger value="language" className="data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white px-4">Language & Content</TabsTrigger>
              </TabsList>
              
              <TabsContent value="system" className="space-y-6">
                <div className="text-slate-300">
                  <p className="mb-6">Configure how you want to interact with the system and how it should respond to you.</p>
                
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="interfaceLanguage" className="text-slate-300">Interface Language</Label>
                        <InfoCircledIcon className="h-4 w-4 text-slate-400" />
                      </div>
                      <Select defaultValue="English">
                        <SelectTrigger id="interfaceLanguage" className="bg-slate-800 border-slate-600 text-slate-200 w-full">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-slate-300">User Experience Level</Label>
                        <InfoCircledIcon className="h-4 w-4 text-slate-400" />
                      </div>
                      <RadioGroup 
                        defaultValue="intermediate" 
                        className="grid grid-cols-1 md:grid-cols-3 gap-3"
                      >
                        <div className="flex flex-col bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="beginner" id="beginner" />
                            <Label htmlFor="beginner" className="font-medium text-slate-200 cursor-pointer">Beginner</Label>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">I'm new to creating educational materials</p>
                        </div>
                        
                        <div className="flex flex-col bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="intermediate" id="intermediate" />
                            <Label htmlFor="intermediate" className="font-medium text-slate-200 cursor-pointer">Intermediate</Label>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">I have some experience with content creation</p>
                        </div>
                        
                        <div className="flex flex-col bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="advanced" id="advanced" />
                            <Label htmlFor="advanced" className="font-medium text-slate-200 cursor-pointer">Advanced</Label>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">I'm experienced in educational content development</p>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-slate-300">Interaction Mode</Label>
                        <InfoCircledIcon className="h-4 w-4 text-slate-400" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer">
                          <RadioGroupItem value="conversational" id="conversational" />
                          <div>
                            <Label htmlFor="conversational" className="font-medium text-slate-200 cursor-pointer">Conversational</Label>
                            <p className="text-xs text-slate-400 mt-1">Interact through natural dialogue</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer">
                          <RadioGroupItem value="structured" id="structured" />
                          <div>
                            <Label htmlFor="structured" className="font-medium text-slate-200 cursor-pointer">Structured</Label>
                            <p className="text-xs text-slate-400 mt-1">Guided form-based interaction</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer">
                          <RadioGroupItem value="direct" id="direct" />
                          <div>
                            <Label htmlFor="direct" className="font-medium text-slate-200 cursor-pointer">Direct</Label>
                            <p className="text-xs text-slate-400 mt-1">Minimal interaction, focus on results</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700 rounded-md p-4 hover:border-slate-600 transition-colors cursor-pointer">
                          <RadioGroupItem value="collaborative" id="collaborative" />
                          <div>
                            <Label htmlFor="collaborative" className="font-medium text-slate-200 cursor-pointer">Collaborative</Label>
                            <p className="text-xs text-slate-400 mt-1">Iterative back-and-forth approach</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="outputDetail" className="text-slate-300">Output Detail Level</Label>
                        <InfoCircledIcon className="h-4 w-4 text-slate-400" />
                      </div>
                      <Select defaultValue="detailed">
                        <SelectTrigger id="outputDetail" className="bg-slate-800 border-slate-600 text-slate-200 w-full">
                          <SelectValue placeholder="Select detail level" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                          <SelectItem value="detailed">Detailed - Comprehensive explanations</SelectItem>
                          <SelectItem value="balanced">Balanced - Moderate detail</SelectItem>
                          <SelectItem value="concise">Concise - Brief outputs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="systemBehavior" className="text-slate-300">System Behavior Style</Label>
                        <InfoCircledIcon className="h-4 w-4 text-slate-400" />
                      </div>
                      <Select defaultValue="balanced">
                        <SelectTrigger id="systemBehavior" className="bg-slate-800 border-slate-600 text-slate-200 w-full">
                          <SelectValue placeholder="Select behavior style" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                          <SelectItem value="creative">Creative - More innovative outputs</SelectItem>
                          <SelectItem value="balanced">Balanced - Mix of creativity and precision</SelectItem>
                          <SelectItem value="precise">Precise - Focus on accuracy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="project" className="space-y-6">
                {/* Project configuration tab content */}
                <div className="text-slate-300">
                  <p>Configure the project type, subjects, and educational standards.</p>
                  {/* Project configuration form fields would go here */}
                </div>
              </TabsContent>
              
              <TabsContent value="language" className="space-y-6">
                {/* Language & Content configuration tab content */}
                <div className="text-slate-300">
                  <p>Configure language settings and content specifications.</p>
                  {/* Language configuration form fields would go here */}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 flex justify-end">
              <Button onClick={handleSaveChanges} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernLayout>
  );
};

export default ConfigurationWorkspace;
