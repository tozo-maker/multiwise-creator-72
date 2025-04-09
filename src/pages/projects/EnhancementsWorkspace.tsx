
import React, { useState, useEffect } from 'react';
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
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { ProjectBreadcrumbs } from '@/components/project/ProjectBreadcrumbs';

export const EnhancementsWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [enhancementType, setEnhancementType] = useState('language');
  const [isGenerating, setIsGenerating] = useState(false);
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
        <ProjectBreadcrumbs projectName={project.name} />
      
        <ProjectWorkspaceHeader 
          projectName={project.name}
          projectType={project.type}
          targetLanguage={project.targetLanguage}
        />
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="enhancements" />
        
        <Card className={isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
        }>
          <CardHeader>
            <CardTitle className={`text-xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Content Enhancements
            </CardTitle>
            <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Generate AI-powered suggestions to improve your educational content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="enhancementType" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Enhancement Type
                </Label>
                <Select 
                  value={enhancementType} 
                  onValueChange={setEnhancementType}
                >
                  <SelectTrigger className={`w-full ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-slate-200' 
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}>
                    <SelectValue placeholder="Select enhancement type" />
                  </SelectTrigger>
                  <SelectContent className={isDark 
                    ? 'bg-slate-800 border-slate-700 text-slate-200' 
                    : 'bg-white border-slate-200 text-slate-900'
                  }>
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
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Content Scope
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="single-section" 
                      className={isDark 
                        ? 'border-slate-500 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600' 
                        : 'border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600'
                      } 
                    />
                    <Label 
                      htmlFor="single-section" 
                      className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                    >
                      Current Section Only
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="all-content" 
                      className={isDark 
                        ? 'border-slate-500 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600' 
                        : 'border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600'
                      }
                    />
                    <Label 
                      htmlFor="all-content" 
                      className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                    >
                      All Content
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Constraints & Guidelines (Optional)
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
                    No files selected. Select files from your Knowledge Base to provide constraints and guidelines.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Enhancement Instructions
                </Label>
                <Textarea 
                  id="instructions" 
                  placeholder="Provide specific instructions for the enhancement suggestions..."
                  className={`min-h-[100px] ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-500' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
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
