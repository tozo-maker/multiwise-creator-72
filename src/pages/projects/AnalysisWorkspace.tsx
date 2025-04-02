
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';

export const AnalysisWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [analysisType, setAnalysisType] = useState('readability');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
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
    { label: 'Analysis' }
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsAnalyzing(false);
      // Here you would handle the response
    }, 3000);
  };
  
  return (
    <MainLayout contentWidth="wide">
      <div className="space-y-6">
        <div className="pt-4">
          <PageBreadcrumbs items={breadcrumbItems} />
        </div>
      
        <ProjectWorkspaceHeader 
          projectName={project.name}
          projectType={project.type}
          targetLanguage={project.targetLanguage}
        />
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="analysis" />
        
        <Card className="border border-slate-200 hover:shadow-sm transition-shadow">
          <CardHeader>
            <CardTitle>Content Analysis</CardTitle>
            <CardDescription>
              Analyze your educational content for readability, standards alignment, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="analysisType">Analysis Type</Label>
                <Select 
                  value={analysisType} 
                  onValueChange={setAnalysisType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select analysis type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="readability">Readability Analysis</SelectItem>
                    <SelectItem value="standards">Standards Alignment</SelectItem>
                    <SelectItem value="language">Language Proficiency Level</SelectItem>
                    <SelectItem value="cultural">Cultural Appropriateness</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Additional Context Files (Optional)</Label>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileText className="h-4 w-4" />
                    Select from Knowledge Base
                  </Button>
                </div>
                <div className="border border-dashed border-slate-300 rounded-md p-6 text-center">
                  <p className="text-sm text-slate-500">
                    No context files selected. Select files from your Knowledge Base to guide the analysis.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions">Analysis Instructions (Optional)</Label>
                <Textarea 
                  id="instructions" 
                  placeholder="Provide any specific instructions for the analysis..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-brand-500 hover:bg-brand-600 gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Run Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AnalysisWorkspace;
