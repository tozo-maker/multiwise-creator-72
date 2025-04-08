
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';

export const EnhancementsWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [enhancementType, setEnhancementType] = useState('language');
  const [isGenerating, setIsGenerating] = useState(false);
  
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
    { label: 'Projects', path: '/projects' },
    { label: project.name, path: `/projects/${projectId}` },
    { label: 'Enhancements' }
  ];
  
  const handleGenerateEnhancements = () => {
    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false);
      // Here you would handle the response
    }, 3000);
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
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="enhancements" />
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-slate-100">Content Enhancements</CardTitle>
            <CardDescription className="text-slate-400">
              Generate AI-powered suggestions to improve your educational content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="enhancementType" className="text-slate-300">Enhancement Type</Label>
                <Select 
                  value={enhancementType} 
                  onValueChange={setEnhancementType}
                >
                  <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-slate-200">
                    <SelectValue placeholder="Select enhancement type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectItem value="language">Language Improvement</SelectItem>
                    <SelectItem value="clarity">Clarity & Readability</SelectItem>
                    <SelectItem value="pedagogy">Pedagogical Strengthening</SelectItem>
                    <SelectItem value="cultural">Cultural Integration</SelectItem>
                    <SelectItem value="engagement">Student Engagement</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive Enhancement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Content Scope</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="single-section" className="border-slate-500 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" />
                    <Label htmlFor="single-section" className="text-sm text-slate-300">Current Section Only</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="all-content" className="border-slate-500 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" />
                    <Label htmlFor="all-content" className="text-sm text-slate-300">All Content</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Constraints & Guidelines (Optional)</Label>
                  <Button variant="outline" size="sm" className="gap-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100">
                    <FileText className="h-4 w-4" />
                    Select from Knowledge Base
                  </Button>
                </div>
                <div className="border border-dashed border-slate-600 rounded-md p-6 text-center bg-slate-800/50">
                  <p className="text-sm text-slate-400">
                    No files selected. Select files from your Knowledge Base to provide constraints and guidelines.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions" className="text-slate-300">Enhancement Instructions</Label>
                <Textarea 
                  id="instructions" 
                  placeholder="Provide specific instructions for the enhancement suggestions..."
                  className="min-h-[100px] bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500"
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleGenerateEnhancements}
                  disabled={isGenerating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Enhancements
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernLayout>
  );
};

export default EnhancementsWorkspace;
