
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
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Content Enhancements</CardTitle>
            <CardDescription>
              Generate AI-powered suggestions to improve your educational content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="enhancementType">Enhancement Type</Label>
                <Select 
                  value={enhancementType} 
                  onValueChange={setEnhancementType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select enhancement type" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label>Content Scope</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="single-section" />
                    <Label htmlFor="single-section" className="text-sm">Current Section Only</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="all-content" />
                    <Label htmlFor="all-content" className="text-sm">All Content</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Constraints & Guidelines (Optional)</Label>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileText className="h-4 w-4" />
                    Select from Knowledge Base
                  </Button>
                </div>
                <div className="border border-dashed border-slate-300 rounded-md p-6 text-center">
                  <p className="text-sm text-slate-500">
                    No files selected. Select files from your Knowledge Base to provide constraints and guidelines.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions">Enhancement Instructions</Label>
                <Textarea 
                  id="instructions" 
                  placeholder="Provide specific instructions for the enhancement suggestions..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleGenerateEnhancements}
                  disabled={isGenerating}
                  className="bg-brand-500 hover:bg-brand-600 gap-2"
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
