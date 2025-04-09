
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Save, Download, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard } from '@/contexts/DashboardContext';

interface DashboardQuickActionsProps {
  hasProjects: boolean;
  className?: string;
}

export const DashboardQuickActions = ({ hasProjects, className }: DashboardQuickActionsProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isDemo, projects } = useDashboard();
  const isDark = theme === 'dark';

  // Function to handle navigation with project ID
  const navigateToProject = (path: string) => {
    // If user has projects, navigate to the first one, otherwise use a default ID
    // which will show appropriate empty states in the target page
    const projectId = projects.length > 0 ? projects[0].id : '1';
    navigate(`/projects/${projectId}${path}`);
  };

  // Get appropriate text for exports button based on user data
  const getExportButtonText = () => {
    if (isDemo || projects.length > 0) {
      return "Export Project";
    }
    return "Export Project";
  };

  return (
    <Card className={`${className} ${isDark ? 'dark:bg-slate-800 dark:border-slate-700 dark:hover:shadow-slate-800/30' : 'bg-white border-slate-200 hover:shadow-slate-200/50'} hover:shadow-md transition-shadow backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Quick Actions</CardTitle>
        <CardDescription className={isDark ? 'dark:text-slate-400' : 'text-slate-600'}>Frequently used functions and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          <Button 
            variant="outline" 
            className={`justify-start h-auto py-3 px-4 ${isDark ? 'dark:border-slate-700 hover:dark:border-brand-700 dark:hover:bg-brand-900/20' : 'border-slate-200 hover:border-brand-200 hover:bg-brand-50'}`}
            onClick={() => navigateToProject('/knowledge-base')}
          >
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center">
                <div className={`h-9 w-9 rounded-full ${isDark ? 'dark:bg-brand-900/30' : 'bg-brand-100'} flex items-center justify-center mr-3`}>
                  <Upload className={`h-5 w-5 ${isDark ? 'dark:text-brand-400' : 'text-brand-600'}`} />
                </div>
                <div className="text-left">
                  <div className={`font-medium ${isDark ? 'dark:text-slate-200' : 'text-slate-800'}`}>Upload Knowledge Base</div>
                  <div className={`text-xs ${isDark ? 'dark:text-slate-400' : 'text-slate-500'} mt-0.5`}>Add reference materials to your project</div>
                </div>
              </div>
              <ArrowRight className={`h-5 w-5 ${isDark ? 'dark:text-slate-600' : 'text-slate-300'} ml-2`} />
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className={`justify-start h-auto py-3 px-4 ${isDark ? 'dark:border-slate-700 hover:dark:border-brand-700 dark:hover:bg-brand-900/20' : 'border-slate-200 hover:border-brand-200 hover:bg-brand-50'}`}
            onClick={() => navigateToProject('/content/new')}
          >
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center">
                <div className={`h-9 w-9 rounded-full ${isDark ? 'dark:bg-brand-900/30' : 'bg-brand-100'} flex items-center justify-center mr-3`}>
                  <Camera className={`h-5 w-5 ${isDark ? 'dark:text-brand-400' : 'text-brand-600'}`} />
                </div>
                <div className="text-left">
                  <div className={`font-medium ${isDark ? 'dark:text-slate-200' : 'text-slate-800'}`}>Generate Content</div>
                  <div className={`text-xs ${isDark ? 'dark:text-slate-400' : 'text-slate-500'} mt-0.5`}>Create AI-assisted educational content</div>
                </div>
              </div>
              <ArrowRight className={`h-5 w-5 ${isDark ? 'dark:text-slate-600' : 'text-slate-300'} ml-2`} />
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className={`justify-start h-auto py-3 px-4 ${isDark ? 'dark:border-slate-700 hover:dark:border-brand-700 dark:hover:bg-brand-900/20' : 'border-slate-200 hover:border-brand-200 hover:bg-brand-50'}`}
            onClick={() => navigateToProject('/snapshots')}
          >
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center">
                <div className={`h-9 w-9 rounded-full ${isDark ? 'dark:bg-brand-900/30' : 'bg-brand-100'} flex items-center justify-center mr-3`}>
                  <Save className={`h-5 w-5 ${isDark ? 'dark:text-brand-400' : 'text-brand-600'}`} />
                </div>
                <div className="text-left">
                  <div className={`font-medium ${isDark ? 'dark:text-slate-200' : 'text-slate-800'}`}>Create Snapshot</div>
                  <div className={`text-xs ${isDark ? 'dark:text-slate-400' : 'text-slate-500'} mt-0.5`}>Save the current state of your project</div>
                </div>
              </div>
              <ArrowRight className={`h-5 w-5 ${isDark ? 'dark:text-slate-600' : 'text-slate-300'} ml-2`} />
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className={`justify-start h-auto py-3 px-4 ${isDark ? 'dark:border-slate-700 hover:dark:border-brand-700 dark:hover:bg-brand-900/20' : 'border-slate-200 hover:border-brand-200 hover:bg-brand-50'}`}
            onClick={() => {
              if (projects.length > 0) {
                navigateToProject('/export');
              } else if (!isDemo) {
                // For real users with no projects, show a message or redirect to project creation
                navigate('/projects/create');
              } else {
                // For demo users, just navigate to a fake export page
                navigate('/projects/1/export');
              }
            }}
          >
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center">
                <div className={`h-9 w-9 rounded-full ${isDark ? 'dark:bg-brand-900/30' : 'bg-brand-100'} flex items-center justify-center mr-3`}>
                  <Download className={`h-5 w-5 ${isDark ? 'dark:text-brand-400' : 'text-brand-600'}`} />
                </div>
                <div className="text-left">
                  <div className={`font-medium ${isDark ? 'dark:text-slate-200' : 'text-slate-800'}`}>{getExportButtonText()}</div>
                  <div className={`text-xs ${isDark ? 'dark:text-slate-400' : 'text-slate-500'} mt-0.5`}>Download your content in various formats</div>
                </div>
              </div>
              <ArrowRight className={`h-5 w-5 ${isDark ? 'dark:text-slate-600' : 'text-slate-300'} ml-2`} />
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
