
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { ProjectBreadcrumbs } from '@/components/project/ProjectBreadcrumbs';

export const AnalysisWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [analysisType, setAnalysisType] = useState('readability');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [project, setProject] = useState({
    id: projectId || '',
    name: 'Loading...',
    type: 'Loading...',
    targetLanguage: 'Loading...'
  });
  
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setProject({
            id: data.id,
            name: data.name,
            type: data.type,
            targetLanguage: data.target_language
          });
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    
    fetchProject();
  }, [projectId]);
  
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsAnalyzing(false);
      // Here you would handle the response
    }, 3000);
  };
  
  return (
    <ModernLayout contentWidth="wide">
      <div className="space-y-6">
        <ProjectBreadcrumbs projectName={project.name} />
      
        <ProjectWorkspaceHeader 
          projectName={project.name}
          projectType={project.type}
          targetLanguage={project.targetLanguage}
        />
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="analysis" />
        
        <Card className={isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
        }>
          <CardHeader>
            <CardTitle className={`text-xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Content Analysis
            </CardTitle>
            <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Analyze your educational content for readability, standards alignment, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="analysisType" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Analysis Type
                </Label>
                <Select 
                  value={analysisType} 
                  onValueChange={setAnalysisType}
                >
                  <SelectTrigger className={`w-full ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-slate-200' 
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}>
                    <SelectValue placeholder="Select analysis type" />
                  </SelectTrigger>
                  <SelectContent className={isDark 
                    ? 'bg-slate-800 border-slate-700 text-slate-200' 
                    : 'bg-white border-slate-200 text-slate-900'
                  }>
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
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Additional Context Files (Optional)
                  </Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`gap-1 ${
                      isDark 
                        ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100' 
                        : 'border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    Select from Knowledge Base
                  </Button>
                </div>
                <div className={`border border-dashed rounded-md p-6 text-center ${
                  isDark 
                    ? 'border-slate-600 bg-slate-800/50 text-slate-400' 
                    : 'border-slate-300 bg-slate-50/50 text-slate-500'
                }`}>
                  <p className="text-sm">
                    No context files selected. Select files from your Knowledge Base to guide the analysis.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Analysis Instructions (Optional)
                </Label>
                <Textarea 
                  id="instructions" 
                  placeholder="Provide any specific instructions for the analysis..."
                  className={`min-h-[100px] ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-500' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
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
    </ModernLayout>
  );
};

export default AnalysisWorkspace;
