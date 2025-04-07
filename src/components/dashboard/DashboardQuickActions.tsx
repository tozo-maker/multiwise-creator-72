
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Save, Download, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardQuickActionsProps {
  hasProjects: boolean;
  className?: string;
}

export const DashboardQuickActions = ({ hasProjects, className }: DashboardQuickActionsProps) => {
  const navigate = useNavigate();

  return (
    <Card className={`${className} dark:bg-slate-800 dark:border-slate-700`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-white">Quick Actions</CardTitle>
        <CardDescription className="dark:text-slate-400">Frequently used functions and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {hasProjects && (
            <>
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3 px-4 border-slate-200 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                onClick={() => navigate('/projects/1/knowledge-base')}
              >
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mr-3">
                      <Upload className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-800 dark:text-slate-200">Upload Knowledge Base</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Add reference materials to your project</div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 dark:text-slate-600 ml-2" />
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3 px-4 border-slate-200 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                onClick={() => navigate('/projects/1/content/new')}
              >
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mr-3">
                      <Camera className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-800 dark:text-slate-200">Generate Content</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Create AI-assisted educational content</div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 dark:text-slate-600 ml-2" />
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3 px-4 border-slate-200 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                onClick={() => navigate('/projects/1/snapshots')}
              >
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mr-3">
                      <Save className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-800 dark:text-slate-200">Create Snapshot</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Save the current state of your project</div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 dark:text-slate-600 ml-2" />
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3 px-4 border-slate-200 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20"
              >
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mr-3">
                      <Download className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-800 dark:text-slate-200">Export Project</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Download your content in various formats</div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 dark:text-slate-600 ml-2" />
                </div>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
